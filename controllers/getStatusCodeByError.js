const BadRequestError = require('../middlewares/errors/bad-request-error.js');


module.exports = (err, next) => {
  if (err.name === 'ValidationError') {
    next(new BadRequestError(err.message));
  } else {
    next(err);
  }
};
