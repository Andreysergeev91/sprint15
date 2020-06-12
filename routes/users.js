const usersRouter = require('express').Router();

const { getUsers, getUsersById } = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUsersById);

module.exports = usersRouter;
