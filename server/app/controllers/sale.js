const asyncHandler = require('express-async-handler')
const Customer = require('../models/customer')
const { Sale } = require('./../models/sale')

exports.getAllSales = asyncHandler(async (req, res, next) => {
  const sales = await Sale.find({}).populate('items.item').populate('customer')

  res.status(200).json({
    status: 'success',
    results: sales.length,
    data: {
      sales
    }
  })
})

exports.getSale = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const sale = await Sale.findById(id).populate('items.item').populate('customer')

  res.status(200).json({
    status: 'success',
    data: {
      sale
    }
  })
})

exports.updateSale = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  await Sale.findByIdAndUpdate(id, req.body)
  const sale = await Sale.findById(id).populate('items.item').populate('customer')

  res.status(200).json({
    status: 'success',
    data: {
      sale
    }
  })
})

exports.addSale = asyncHandler(async (req, res, next) => {
  await Customer.updateOne({ email: req.body.customer.email }, req.body.customer, { upsert: true })
  const customer = await Customer.findOne({ email: req.body.customer.email })
  req.body.customer = customer.id

  let sale = new Sale(req.body)
  await sale.save()
  sale = await Sale.findById(sale.id).populate('items.item').populate('customer')

  res.status(201).json({
    status: 'success',
    data: {
      sale
    }
  })
})

exports.deleteSale = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  await Sale.findByIdAndDelete(id)

  res.status(204).json({
    status: 'success',
    data: {}
  })
})
