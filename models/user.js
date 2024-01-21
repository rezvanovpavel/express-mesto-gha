const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Нужно ввести URL',
    },
    required: true,
    default: 'https://chance4traveller.com/wp-content/uploads/2021/02/b96ce22cfdae9849ce9daeb32b5b4da3.jpg',
  },
});

module.exports = mongoose.model('user', userSchema);