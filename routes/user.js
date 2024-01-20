const router = require('express').Router(); // создали роутер
const User = require('../models/user');

const { createUser } = require('../controllers/users');
const { getUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users', createUser);

module.exports = router; // экспортировали роутер
