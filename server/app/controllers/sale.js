const asyncHandler = require('express-async-handler')
const Sale = require('./../models/sale')
const Item = require('./../models/item')

exports.getAllSales = asyncHandler(async (req, res, next) => {
  res.send('GET ALL SALE')
})

exports.getSale = asyncHandler(async (req, res, next) => {
  res.send('GET SALE')
})

exports.updateSale = asyncHandler(async (req, res, next) => {
  res.send('UPDATE SALE')
})

exports.addSale = asyncHandler(async (req, res, next) => {
  res.send('ADD SALE')
})

exports.deleteSale = asyncHandler(async (req, res, next) => {
  res.send('DELETE SALE')
})