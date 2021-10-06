/**
 * @lib/framework
 */
const express = require("express");
const mongoose = require('mongoose')
const HttpStatus = require("http-status-codes");
const jsonwebtoken = require('jsonwebtoken')
/**
 * @models
 */
const CompanyCollection = require('../models/Company')
const ReviewCollection = require('../models/Reviews')
/**
 * @helpers
 */
const { URLPattern, emailPattern, htmlElemPattern } = require('../helper/regex-patterns')
const MailSender = require('../helper/email')
const { SECRET_KEY, FRONTEND_HOST } = require('../helper/constants')

// to pass the root/parent request params this route.
const app = express.Router({ mergeParams: true })

const reviewRequestValidation = (req, res, next) => {
  let {
    fullName = '',
    email = '',
    review = '',
    ratingScore = 0,
  } = req.body
  if (
    (!fullName) ||
    (fullName.match(htmlElemPattern) || fullName.match(emailPattern) || fullName.match(URLPattern)) ||
    (email.match(htmlElemPattern)) || // remove checking of email pattern on email property
    (review.match(htmlElemPattern) || review.match(emailPattern) || review.match(URLPattern) || !(review && review.length > 4)) ||
    (isNaN(ratingScore))
  ) {
    // validate submitted properties on post review
    // if any properties are match thru the validation pattern, end the request.
    res.status(HttpStatus.OK).json({
      sucess: false,
      result: null,
      error: null
    })
    console.log('### found malicious pattern on request body of post review, Ignore the request. ####');
    return
  }
  next()
}
/**
 * post a review
 * @requestParams
 *  -companyId: string // id of the company
 * @requestBody
 *  -name: string*
 *  -email: string*
 *  -content: string*
 */
app.post('/', reviewRequestValidation, async (req, res, next) => {
  const { companyId = '' } = req.params
  let {
    fullName = '',
    email = '',
    review = '',
    ratingScore = 0,
  } = req.body
  ratingScore = parseFloat(ratingScore)
  fullName = fullName.toString().trim()
  const companyDetails = await CompanyCollection.findOne({
    _id: mongoose.Types.ObjectId(companyId)
  })
  if (!companyDetails) {
    throw new Error('No company details found.')
  }
  try {
    const newReview = new ReviewCollection({
      fullName: fullName.charAt(0).toUpperCase().concat(fullName.substr(1)),
      email: email.toString().trim(),
      review: review.toString().trim(),
      company_id: companyId.toString().trim(),
      ratingScore: ratingScore >= 0 ? ratingScore : 0, // to prevent the negative values,
      createdAt: new Date(),
    })
    const token = jsonwebtoken.sign({
      company_review_id: newReview._id,
      company_full_url: companyDetails.address.full_url
    }, SECRET_KEY, {
      // 7 days
      expiresIn: (7 * (24 * (60 * 1000)))
    })
    // send email
    new MailSender()
      .sendEmailTemplate({
        email: email,
        data: {
          fullName: newReview.fullName,
          companyName: companyDetails.companyName,
          verificationLink: `${FRONTEND_HOST}/api/v1/company/${companyDetails._id}/review/verify?token=${token}`
        }
      })
    await newReview.save()
    res.status(HttpStatus.OK).json({
      sucess: true,
      result: token,
      error: null
    })
  } catch (error) {
    res.status(HttpStatus.OK).json({
      sucess: false,
      result: null,
      error: error.message
    })
  }
})
/**
 * get all company reviews
 * @requestParams
 *  -companyId: string // id of the company
 */
app.get('/', async (req, res, next) => {
  const { companyId = '' } = req.params
  try {
    const reviews = await ReviewCollection.find({
      company_id: companyId.toString(),
      sentEmailConfirmed: true
    })
      .sort({
        createdAt: -1
      })
    res.status(HttpStatus.OK).json({
      sucess: true,
      result: reviews,
      error: null
    })
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      sucess: false,
      result: null,
      error: err.message
    })
  }
})
/**
 * verify the review from the company
 * @requestParams
 * -companyId: string // id of the company
 * @requestQuery
 *  -token: string
 */
app.get('/verify', (req, res, next) => {
  const { companyId = '' } = req.params
  const {
    token = ''
  } = req.query

  jsonwebtoken.verify(token, SECRET_KEY, {}, async (err, decoded) => {
    try {
      if (err) {
        throw err
      }
      const { company_full_url, company_review_id } = decoded
      const selectedReview = await ReviewCollection.findOne({
        // to convert the string to objectId
        _id: mongoose.Types.ObjectId(company_review_id)
      })
      if (!selectedReview) {
        throw new Error('No review data found.')
      }
      if (selectedReview.sentEmailConfirmed) {
        throw new Error('Review already verified.')
      }
      selectedReview.sentEmailConfirmed = true
      selectedReview.updatedAt = new Date()
      await selectedReview.save()
      res.writeHead(301,
        { Location: `${FRONTEND_HOST}/areas/${company_full_url}?successfullyVerified=true` }
      );
      res.end()
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        sucess: false,
        result: null,
        error: error.message
      })
    }
  })
})


module.exports = app