const mongoose = require('mongoose')
const { ItemSchema } = require('./item')

const schema = new mongoose.Schema({
  quantity: String,
  items: [
    {
      ...ItemSchema,
      quantity: Number
    }
  ]
})

const Sale = mongoose.model('Sale', schema)

exports.SaleSchema = schema
module.exports = Sale