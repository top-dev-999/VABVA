const mongoose = require("mongoose");
// company.location object
const CompanyAddressSchema = new mongoose.Schema({
  postcode: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  locality: {
    type: String,
    default: ''
  },
  county: {
    type: String,
    default: '',
  },
  county_full: {
    type: String,
    default: '',
  },
  full_url: {
    type: String,
    default: '',
  }
}, { _id: false })
// company.license object
const CompanyLicenseSchema = new mongoose.Schema({
  number: {
    type: String,
    default: ''
  },
  registered: {
    type: Date,
    default: 0
  },
  expires: {
    type: Date,
    default: 0
  },
}, { _id: false })
// company.details object
const CompanyDetailsSchema = new mongoose.Schema({
  website: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  video: {
    type: String,
    default: ''
  },
  tags: [
    {
      type: String,
      default: ''
    }
  ],
}, { _id: false })

const CompanyLocationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    default: [0, 0],
  }
}, { _id: false })

const CompanySchema = new mongoose.Schema(
  {
    id: {
      type: Number
    },
    companyName: {
      type: String,
      default: '',
    },
    companyNumber: {
      type: String,
      default: '',
    },
    license: CompanyLicenseSchema,
    address: CompanyAddressSchema,
    details: CompanyDetailsSchema,
    location: CompanyLocationSchema,
    SIC: {
      type: Array
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
  });
const CompanyCollection = mongoose.model("companies", CompanySchema);

module.exports = CompanyCollection;