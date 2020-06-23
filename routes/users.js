const usersRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { getUsers, getUsersById } = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', celebrate({

  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUsersById);

module.exports = usersRouter;
