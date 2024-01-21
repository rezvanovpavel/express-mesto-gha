const User = require('../models/user');
const VALIDATION_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;

const createUser = (req, res) => {
  const { name, about,avatar } = req.body;

  User.create({ name, about,avatar })
    .then(user => res.send(user))
    .catch((err) => {if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send("Переданы некорректные данные")});
};

const getUsers = (req, res) => {
  User.find({})
      .then(users => res.send(users))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const userId = req.params.userId
  User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(NOT_FOUND_ERROR_CODE).send("Запрашиваемый пользователь не найден")
        }
        return res.send(user);
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateInfo = (req, res) => {
  const userId = req.user._id
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about },{ new: true} )
      .then((user) => {
        if (!user) {return res.status(NOT_FOUND_ERROR_CODE).send("Запрашиваемый пользователь не найден")};
        return res.send(user);
      })
      .catch((err) => {if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send("Переданы некорректные данные")});
};

const updateAvatar = (req, res) => {
  const userId = req.user._id
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar },{ new: true} )
      .then((user) => {
        if (!user) {return res.status(NOT_FOUND_ERROR_CODE).send("Запрашиваемый пользователь не найден")};
        return res.send(user);
      })
      .catch((err) => {if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send("Переданы некорректные данные")});
};

module.exports = {
  getUsers, getUser, createUser,updateInfo,updateAvatar
};