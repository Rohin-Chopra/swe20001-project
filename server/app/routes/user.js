const express = require('express')
const router = express.Router()
const auth = require('../auth');
const {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/user')

router.use(auth.verifyAuthed(true))

router.route('/')
  .get(getAllUsers)
  .post(addUser)

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = router
