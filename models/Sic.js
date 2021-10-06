const mongoose = require("mongoose");
const SicSchema = new mongoose.Schema({
  section: {
    type: String
  },
  code: {
    type: String
  },
  description: {
    type: String
  },
  tags: {
    type: Array
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});
const sicSchema = mongoose.model("sic_details", SicSchema);

module.exports = sicSchema;