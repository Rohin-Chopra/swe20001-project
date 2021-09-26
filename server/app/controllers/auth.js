const asyncHandler = require('express-async-handler');

const auth = require('../auth.js');
const { User } = require('../models/user');

module.exports.login = async (req, res, next) => {
  res.json(await auth.signUser(req.user));
};

module.exports.verify = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  if (typeof token !== 'string') {
    res.sendStatus(400);
    return;
  }

  const decoded = await auth.decodeToken(token);
  if (!decoded) {
    console.warn('refused to verify user due to unknown token decoding error');
    res.sendStatus(401);
    return;
  }

  const user = await User.findById(decoded.id)
  if (!user) {
    console.warn('refused to verify user, token is invalid');
    return;
  }

  res.json(await auth.signUser(user));
});
