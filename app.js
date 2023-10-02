require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const port = 3000;
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { rateLimiter } = require('./middlewares/rate-limit');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NODE_ENV, DB_SERVER } = process.env;
const { createUser, login } = require('./controllers/users');
const users = require('./routes/users');
const movies = require('./routes/movies');
const auth = require('./middlewares/auth');
const { deleteJwtCookie } = require('./middlewares/deleteCookie');
const {
  loginValidator,
  createUserValidator,
} = require('./validators/validators');

mongoose.connect(NODE_ENV === 'production' ? DB_SERVER : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('MongoDB Active');
});

rateLimiter();

app.use(cors());

app.use(helmet());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);
app.use(auth);
app.use('/users', users);
app.use('/movies', movies);
app.post('/signout', deleteJwtCookie);

app.use('*', (req, res, next) => {
  return next(new NotFoundError('Страница не найдена.'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
