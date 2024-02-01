const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав доступа');
      }
      return Card.findByIdAndRemove(cardId).then((deletedCard) => res.send(deletedCard));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
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
      throw new NotFoundError('Такой карточки не существует');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
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
      throw new NotFoundError('Такой карточки не существует');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
