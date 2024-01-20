const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.js');


const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.use('/users', userRoutes);



app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
