const fs = require("fs");
const hbs = require("hbs");
// const nodemailer = require("nodemailer");
// const mailGunTransport = require('nodemailer-mailgun-transport')
const {
  AWS_SECRET_KEY,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SES_SOURCE,
} = require("./constants");
const aws = require("aws-sdk");

aws.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});
const ses = new aws.SES({
  apiVersion: "2010-12-01",
});
class Email {
  templatePath = `../email-templates`;
  constructor() {}
  /**
   * send email
   * @param data
   */
  async sendMail(data) {
    try {
      const { email, bcc = [], title, body } = data;
      if (!email) {
        throw new Error("Email is required on sending email.");
      }
      const params = {
        Source: AWS_SES_SOURCE,
        Destination: {
          ToAddresses: [email], // Email address/addresses that you want to send your email
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: body,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Review Confirmation - VABVA",
          },
        },
      };
      console.log("Sending...");
      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          console.log("email submitted to SES", data);
        })
        .catch((error) => {
          console.log(error);
        });
      // await ses.sendMail({
      //   from: `info@getskip.co.uk`,
      //   to: email,
      //   subject: `Review Confirmation - GetSkip`,
      //   html: body,
      // })
      // console.log('email sent.')
      return true;
    } catch (err) {
      console.log(" failed to send email template. Error: ", err);
      throw err;
    }
  }
  /**
   * set email template
   * @param emailData
   */
  sendEmailTemplate(emailData) {
    const self = this;
    const { title = "", email = "", data } = emailData;
    const fileLoc = `${__dirname}/${self.templatePath}/verify-review.hbs`;
    const source = fs.readFileSync(fileLoc, "utf8");
    const templateEmail = hbs.compile(source);
    const content = templateEmail(data);
    return self.sendMail({
      email,
      title,
      body: content,
    });
  }
}
module.exports = Email;
