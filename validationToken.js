// const generateToken = require('./generateToken');

const validationToken = (req, res, next) => {
  const { authorization: tokenValidation } = req.headers;
  // console.log(tokenValidation);
  // const token = generateToken();
  // console.log(token);

  if (!tokenValidation) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (tokenValidation.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  // const token = generateToken();
  // res.status(200).json({ tokenValidation });

  next();
};

module.exports = validationToken;
