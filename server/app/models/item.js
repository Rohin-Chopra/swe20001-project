const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: 'string',
  description: 'string'
})

const Item = mongoose.model('Item', schema)

exports.ItemSchema = schema
module.exports = Item