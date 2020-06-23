const mongoose = require('mongoose');
const Card = require('../models/card');
const getStatusCodeByError = require('./getStatusCodeByError');
const NotfoundError = require('../middlewares/errors/not-found-error');
const ForbiddenError = require('../middlewares/errors/forbidden-error');
const BadRequestError = require('../middlewares/errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    Card.findById(req.params.cardId)
      .then((card) => {
        if (card == null) {
          throw new NotfoundError('Карточка с данным Id не найдена');
        } else if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
          throw new ForbiddenError('Карточка создана другим пользователем');
        } else {
          Card.deleteOne(card, (err) => {
            if (err) {
              throw err;
            } else {
              res.send({ data: card });
            }
          });
        }
      })
      .catch(next);
  } else {
    next(new BadRequestError('Введен некорректный id карточки'));
  }
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => getStatusCodeByError(err, next));
};
