const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: String,
  region: String
});

module.exports = countrySchema;
