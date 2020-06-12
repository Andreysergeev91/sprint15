module.exports.checkLinkValidation = (res, err) => {
  if (err.name === 'ValidationError') {
    res.status(400);
  } else {
    res.status(500);
  }
  res.send({ data: err.message });
};
