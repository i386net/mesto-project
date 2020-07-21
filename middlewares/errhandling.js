module.exports.errHandling = (err, req, res) => {
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).send({ error: `Карточка с _id ${req.params.cardId} не найдена` });
  }
  return res.status(500).send({ error: err.message });
};
