const express = require('express');

const rateLimit = require('express-rate-limit');

const helmet = require('helmet');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const { validationForCreateUser, validationForLogin } = require('./routes/request-validation');

const { createUser, login } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');

require('dotenv').config();


const {
  PORT = 3000,
} = process.env;


const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


app.use(limiter);

app.use(helmet());

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
// eslint-disable-next-line no-console
}).catch((err) => console.error(err));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validationForCreateUser, createUser);
app.post('/signin', validationForLogin, login);


app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));


app.all('*', (req, res) => {
  res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  });
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
