const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const getStatusCodeByError = require('./getStatusCodeByError');
const NotfoundError = require('../middlewares/errors/not-found-error');
const AuthorizationError = require('../middlewares/errors/authorization-error');
const BadRequestError = require('../middlewares/errors/bad-request-error');


module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user == null) {
          throw new NotfoundError('Пользователь с данным Id не найден');
        } else {
          res.send({ data: user });
        }
      })
      .catch(next);
  } else {
    next(new BadRequestError('Введен некорректный id'));
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => getStatusCodeByError(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 168 * 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      next(new AuthorizationError(err.message));
    });
};
