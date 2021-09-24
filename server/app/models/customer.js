const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  {
    timestamps: true
  }
)

const Customer = mongoose.model('Customer', schema)

exports.CustomerSchema = schema
module.exports = Customer