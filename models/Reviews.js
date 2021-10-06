const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    id: {
      type: Number
    },
    fullName: {
      type: String,
      default: '',
    },
    company_id: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    review: {
      type: String,
      default: '',
    },
    ratingScore: {
      type: Number,
      default: 0
    },
    sentEmailConfirmed: {
      type: Boolean,
      default: false
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
const ReviewCollection = mongoose.model("reviews", ReviewSchema);

module.exports = ReviewCollection;