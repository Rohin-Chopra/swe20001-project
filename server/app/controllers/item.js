const asyncHandler = require('express-async-handler')
const Item = require('./../models/item')

exports.getAllItems = asyncHandler(async (req, res, next) => {
  res.send('GET ALL Items')
})

exports.getItem = asyncHandler(async (req, res, next) => {
  res.send('GET ITEM')
})

exports.addItem = asyncHandler(async (req, res, next) => {
  res.send('GET ITEM')
})

exports.updateItem = asyncHandler(async (req, res, next) => {
  res.send('GET ITEM')
})

exports.deleteItem = asyncHandler(async (req, res, next) => {
  res.send('GET ITEM')
})