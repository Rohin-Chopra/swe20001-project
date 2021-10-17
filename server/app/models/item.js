const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String
  },
  {
    timestamps: true
  }
)

const Item = mongoose.model('Item', schema)

exports.itemSchema = schema
exports.Item = Item
