const express = require('express')
const router = express.Router()
const {
  getAllSales,
  getSale,
  addSale,
  updateSale,
  deleteSale
} = require('../controllers/sale')

router.route('/')
  .get(getAllSales)
  .post(addSale)

router.route('/:id')
  .get(getSale)
  .put(updateSale)
  .delete(deleteSale)

module.exports = router
