const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    const user = await User.findById(payload._id);
    if (!user) {
      throw new UnauthorizedError('Необходима авторизация');
    }
  } catch (err) {
    res.clearCookie('jwt');
    next(err);
  }
  req.user = payload;
  next();
};
