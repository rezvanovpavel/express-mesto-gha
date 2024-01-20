const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about,avatar } = req.body;

  User.create({ name, about,avatar })
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUsers = (req, res) => {
  User.find({})
      .then(users => res.send({ data: users }))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const userId = req.params.userId
  User.findById(userId)
      .then((user) => {
        if (!user) {
          throw new NotFoundError(
            'Такого пользователя не существует',
          );
        }
        return res.send({ data: user });
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUsers, getUser, createUser
};