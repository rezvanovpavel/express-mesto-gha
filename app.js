const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');

const login = require('./controllers/users');
const createUser = require('./controllers/users');

const auth = require('./middlewares/auth');

const NOT_FOUND_ERROR_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('*', (req, res, next) => {
  next(res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Запрашиваемый адрес не найден',
  }));
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
