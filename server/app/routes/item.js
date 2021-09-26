const express = require('express')
const router = express.Router()
const auth = require('../auth');
const {
  getAllItems,
  getItem,
  addItem,
  updateItem,
  deleteItem
} = require('../controllers/item')

router.use(auth.verifyAuthed())

router.route('/')
  .get(getAllItems)
  .post(addItem)

router.route('/:id')
  .get(getItem)
  .put(updateItem)
  .delete(deleteItem)

module.exports = router
