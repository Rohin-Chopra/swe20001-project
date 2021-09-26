const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    email: String,
    passwordHash: String
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', schema)

exports.UserSchema = schema
exports.User = User
