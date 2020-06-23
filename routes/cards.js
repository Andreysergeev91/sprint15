const cardsRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { getCards, createCard, deleteCard } = require('../controllers/cards');


cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),

  }),
}), createCard);
cardsRouter.delete('/cards/:cardId', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

module.exports = cardsRouter;
