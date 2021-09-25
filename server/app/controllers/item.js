const asyncHandler = require('express-async-handler')
const { Item } = require('./../models/item')

exports.getAllItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find({})

  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      items
    }
  })
})

exports.getItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const item = await Item.findById(id)

  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  })
})

exports.addItem = asyncHandler(async (req, res, next) => {
  const item = new Item(req.body)
  await item.save()
  res.status(201).json({
    status: 'success',
    data: {
      item
    }
  })
})

exports.updateItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  await Item.findByIdAndUpdate(id, req.body)
  const item = await Item.findById(id)

  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  })
})

exports.deleteItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  await Item.findByIdAndDelete(id)

  res.status(204).json({
    status: 'success',
    data: {}
  })
})
