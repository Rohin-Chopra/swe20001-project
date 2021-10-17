const asyncHandler = require('express-async-handler')
const { User } = require('./../models/user')

const bcrypt = require('bcrypt')

async function hashPassword({ password, ...rest }) {
  if (!password) {
    return rest;
  }

  return {
    ...rest,
    passwordHash: await bcrypt.hash(password, 10)
  };
}

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}, { passwordHash: 0 })

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  })
})

exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id, { passwordHash: 0 })

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

exports.addUser = asyncHandler(async (req, res, next) => {
  const user = new User(await hashPassword(req.body))
  await user.save()
  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  })
})

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  await User.findByIdAndUpdate(id, await hashPassword(req.body))
  const user = await User.findById(id, { passwordHash: 0 })

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  await User.findByIdAndDelete(id)

  res.status(204).json({
    status: 'success',
    data: {}
  })
})
