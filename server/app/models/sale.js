const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    items: [
      {
        item: { type: mongoose.Types.ObjectId, ref: 'Item' },
        quantity: Number
      }
    ],
    customer: { type: mongoose.Types.ObjectId, ref: 'Customer' }
  },
  {
    timestamps: true
  }
)

const Sale = mongoose.model('Sale', schema)

exports.saleSchema = schema
exports.Sale = Sale