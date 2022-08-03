const validationTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk || typeof talk !== 'object') {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' }); 
  }

  next();
};

module.exports = validationTalk;
