const express = require("express");
const HttpStatus = require("http-status-codes");
const CompanyCollection = require("../models/Company");
const ReviewCollection = require("../models/Reviews");
const LocationCollection = require("../models/Locations");
const SICCollection = require("../models/Sic");

// to pass the root/parent request params this route.
const app = express.Router({ mergeParams: true });
const ReviewRoute = require("./reviews");

app.use("/:companyId/review", ReviewRoute);
/**
 * get company details,
 * @requestQuery
 *  - company_full_url: string
 */
app.get("/", async (req, res, next) => {
  const { company_full_url = "" } = req.query;
  try {
    const companyDetails = await CompanyCollection.findOne({
      "address.full_url": company_full_url.toString().trim(),
    });

    _reviews = await ReviewCollection.aggregate([
      {
        $match: {
          company_id: companyDetails._id.toString(),
          sentEmailConfirmed: true,
        },
      },
      {
        $group: {
          _id: "$company_id",
          ratingScore: { $avg: "$ratingScore" },
          minReviews: { $min: "$ratingScore" },
          maxReviews: { $max: "$ratingScore" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    let reviews = await ReviewCollection.find({
      company_id: companyDetails._id.toString(),
    })
      .sort({
        createdAt: -1,
      })
      .limit(200);

    let totalAverageReviews = _reviews.length > 0 ? _reviews[0].ratingScore : 0;
    let totalReviews = _reviews.length > 0 ? _reviews[0].totalReviews : 0;
    let minReviews = _reviews.length > 0 ? _reviews[0].minReviews : 0;
    let maxReviews = _reviews.length > 0 ? _reviews[0].maxReviews : 0;

    let search = await getCompanyMeta(
      companyDetails,
      {
        total: totalReviews,
        average: totalAverageReviews,
        minimum: minReviews,
        maximum: maxReviews,
      },
      reviews
    );

    let result = {
      ...companyDetails.toJSON(),
      search,
      totalReviews,
      totalAverageReviews,
    };

    delete result.SIC;
    delete result.license;
    delete result.createdAt;
    delete result.updatedAt;

    console.log(
      JSON.stringify({
        sucess: true,
        result,
        error: null,
      })
    );

    res.status(HttpStatus.OK).json({
      sucess: true,
      result,
      error: null,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      sucess: false,
      result: null,
      error: error.message,
    });
  }
});

/**
 * Build SEO tags and JSON-LD structure for any specific company
 *
 */

let getCompanyMeta = async (company, stats, reviews) => {
  // console.log(company)

  let metaTitle = `${company.companyName} Reviews | ${
    stats.total > 0 ? `Read Customer Service` : `Write Customer Service`
  } Reviews of ${company.companyName}`;
  let metaDescription = `${
    stats.total > 0
      ? `Join the ${stats.total} people who’ve already reviewed ${company.companyName}. Your experience can help others make better choices.`
      : `Be the first person to review ${company.companyName}. Your experience can help others make better choices.`
  }`;

  let nearestAreaQuery = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: company.location.coordinates,
        },
      },
    },
  };

  let nearestArea = await LocationCollection.find(nearestAreaQuery).limit(1);

  let prefixTag = `/maps/place/${nearestArea[0].county.split(" ").join("+")}/@${
    company.location.coordinates[1]
  },${company.location.coordinates[0]}/`;

  let sicTags = await SICCollection.find({ code: { $in: company.SIC } });

  let tagged = [];
  let added = "";
  sicTags.map((_SIC) => {
    if (_SIC.tags.length > 0) {
      let regex = new RegExp(_SIC.tags[0], "i");
      if (regex.test(added) == false) {
        added += _SIC.tags[0];
        tagged.push({
          name: _SIC.tags[0],
          url: (`${prefixTag}services/${_SIC.tags[0].split(" ").join("-")}/distance/10-miles/reviews/0`).toLowerCase(),
        });
      }
    }
  });

  let reviewSchema = [];

  reviewSchema = reviews.map((_review) => {
    return {
      "@type": "Review",
      itemReviewed: {
        "@type": "Thing",
        name: company.companyName,
      },
      author: {
        "@type": "Person",
        name: _review.fullName,
      },
      datePublished: _review.createdAt,
      headline: _review.review.slice(0, 30),
      reviewBody: _review.review,
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        name: "VABVA",
        sameAs: "https://vabva.com",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: _review.ratingScore,
      },
    };
  });

  let schema = [
    {
      "@context": "http://schema.org",
      "@type": "LocalBusiness",
      name: company.companyName,
      "@id": `https://vabva.com/areas/${company.address.full_url}`,
      aggregateRating: {
        "@type": "AggregateRating",
        reviewCount: stats.total,
        ratingValue: stats.average,
        worstRating: stats.minimum,
        bestRating: stats.maximum,
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: company.location.coordinates[1],
        longitude: company.location.coordinates[0],
      },
      reviews: reviewSchema,
      image: [
        {
          "@type": "ImageObject",
          url: "https://vabva.com/default_logo.png",
        },
      ],
    },
  ];

  if (stats.total == 0) {
    delete schema[0].aggregateRating;
  }

  if (company.details && company.details.website.length > 0) {
    schema[0].url = company.details.website;
  }

  // console.log("here1 - 13424")

  //update address section
  if (company.address.postcode.length > 0) {
    schema[0].address["PostalCode"] = company.address.postcode;
  }
  if (company.address.county.length > 0) {
    schema[0].address["addressLocality"] = company.address.county;
  }
  if (company.address.address.length > 0) {
    schema[0].address["streetAddress"] = company.address.address;
  }

  return {
    meta: metaTitle,
    description: metaDescription,
    tags: tagged,
    schema,
  };
};

module.exports = app;
