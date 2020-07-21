const cardNotFoundErrHandling = (err, req, res) => {
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).send({ error: `Карточка с _id ${req.params.cardId} не найдена` });
  }
  return res.status(500).send({ error: err.message });
};

const validationErrorHandling = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }
  return res.status(500).send({ error: err.message });
};

module.exports = { cardNotFoundErrHandling, validationErrorHandling };
