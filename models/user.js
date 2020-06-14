const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const validate = require('mongoose-validator');

const AuthorizationError = require('../middlewares/errors/authorization-error');

const avatarLinkValidator = [
  validate({
    validator: 'isURL',
    message: 'There should be a link in this field',
  }),
];

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'There should be an Email adress in this field',
  }),
];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: avatarLinkValidator,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthorizationError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthorizationError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
