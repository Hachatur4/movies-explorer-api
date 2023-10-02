const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequesError = require('../errors/bad-request-error');
const VerificationError = require('../errors/verification-error');
const { NODE_ENV, JWT_SECRET } = process.env;

function addCookieToResponse(res, user) {
  const token = jwt.sign(
    { _id: user._id },
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    { expiresIn: '7d' },
  );
  res
    .status(200)
    .cookie('jwt', token, { maxAge: 604800000, httpOnly: true })
    .send({
      token,
      user: {
        user: {
          "_id": user._id,
          "name": user.name,
          "email": user.email,
        },
      },
    });
}

function usersPasswordHandler(pass) {
  return bcrypt.hash(pass, 10);
}

module.exports.getUser = (req, res, next) => {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанного id нет в базе данных.');
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequesError('Некорректные данные.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;

  usersPasswordHandler(req.body.password)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      "name": user.name,
      "email": user.email,
      "_id": user._id,
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new VerificationError('Пользователь с данным email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Такого пользователя не существует.');
      }
      bcrypt.compare(password, user.password, (error, isValid) => {
        if (!isValid) {
          return next(new UnauthorizedError('Неправильные почта или пароль.'));
        }
        addCookieToResponse(res, user);
      });
    })
    .catch((err) => {
      res.clearCookie('jwt');
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.find({ email })
    .then((emailStatus) => {
      if (emailStatus.length === 0) {
        return User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
          .then((user) => {
            res.status(200).send({ user });
          });
      }
      return next(new BadRequesError('Данная почта не может быть использованна'));
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequesError('Переданы некорректные данные при создании пользователя.'));
      } if (err.name === "CastError") {
        return next(new BadRequesError('Пользователь по указанному id не найден.'));
      }
      next(err);
    });
};
