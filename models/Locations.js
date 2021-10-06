const mongoose = require("mongoose");

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

const locationSchema = new mongoose.Schema(
  {
    id: {
      type: Number
    },
    name: {
      type: String
    },
    county: {
      type: String
    },
    country: {
      type: String
    },
    grid_reference: {
      type: String
    },
    easting: {
      type: Number
    },
    northing: {
      type: Number
    },
    location: CompanyLocationSchema,
    elevation: {
      type: Number
    },
    postcode_sector: {
      type: String
    },
    local_government_area: {
      type: String
    },
    nuts_region: {
      type: String
    },
    type: {
      type: String
    },
    scanned: {
      type: Boolean
    },
    full_url: {
      type: String
    },
    county_url: {
      type: String
    },
    name_url: {
      type: String
    },
    showCounty: {
      type: Boolean
    },
  });
const LocationsSchema = mongoose.model("locations", locationSchema);

module.exports = LocationsSchema;