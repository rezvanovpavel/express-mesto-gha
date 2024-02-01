const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(URL_REGEX),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Нет пользователя с таким id'));
});

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { responseStatus = err.status || 500, message } = err;
  res.status(responseStatus).send({ message: responseStatus === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
