const express = require('express')
const router = express.Router()
const auth = require('../auth');
const {
  getAllSales,
  getSale,
  addSale,
  updateSale,
  deleteSale
} = require('../controllers/sale')

router.use(auth.verifyAuthed())

router.route('/')
  .get(getAllSales)
  .post(addSale)

router.route('/:id')
  .get(getSale)
  .put(updateSale)
  .delete(deleteSale)

module.exports = router
