const mongoose = require("mongoose");
const PriceSchema = new mongoose.Schema({
  location_id: {
    type: String,
  },
  yard: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  prices: {
    type: Array
  },
  index: {
    type: Number
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});
const priceSchema = mongoose.model("prices", PriceSchema);

module.exports = priceSchema;