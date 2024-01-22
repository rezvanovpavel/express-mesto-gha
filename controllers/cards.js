const Card = require('../models/card');

const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params.cardId;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Такой карточки не существует',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный id' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: owner,
      },
    },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      return res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Такой карточки не существует',
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный id' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: owner,
      },
    },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      return res.status(NOT_FOUND_ERROR_CODE).send({
        message: 'Такой карточки не существует',
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный id' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
