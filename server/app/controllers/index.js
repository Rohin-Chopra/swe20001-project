const path = require('path')

// @desc    Get react home page
// @route   GET /
// @access  Public
exports.getHome = (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'))
}