const router = require('express').Router(); // создали роутер

const {
  updateInfo, getUsers, getUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.patch('/me', updateInfo);

router.patch('/me/avatar', updateAvatar);

module.exports = router; // экспортировали роутер
