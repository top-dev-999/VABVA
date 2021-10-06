const mongoose = require("mongoose");
const CacheSchema = new mongoose.Schema({
  uri: {
    type: String
  },
  content: {
      type: String
  },
  page: {
      type: String
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});
const cacheSchema = mongoose.model("cache", CacheSchema);

module.exports = cacheSchema;