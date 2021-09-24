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

const User = mongoose.model('User', schema)

exports.UserSchema = schema
module.exports = User