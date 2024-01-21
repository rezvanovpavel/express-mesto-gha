const router = require('express').Router(); // создали роутер

const { updateInfo,createUser,getUsers,getUser,updateAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', createUser);

router.patch('/me', updateInfo);

router.patch('/me/avatar', updateAvatar);

module.exports = router; // экспортировали роутер
