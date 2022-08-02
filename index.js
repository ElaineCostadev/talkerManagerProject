const express = require('express');
const bodyParser = require('body-parser');

// meus codigos
const fs = require('fs').promises;
const generateToken = require('./generateToken');

const { validationEmailUser } = require('./validationUser');
const { validationPasswordlUser } = require('./validationUser');

async function readTalker() {
  const talkerList = await fs.readFile('./talker.json', 'utf-8');
  return JSON.parse(talkerList);
}

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
    const talkers = await readTalker();
    res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalker();

  // esse + é dica da Tati na aula, que tranforma string em number
  // O id que tem de params é string e preciso comparar com number que está no documento talker.id
  const findTalker = talkers.find((talker) => talker.id === +id);

  if (!findTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(findTalker);
});

app.post('/login', validationEmailUser, validationPasswordlUser, (_req, res, next) => {
  // const { email, password } = req.body;
  const token = generateToken();
  res.status(200).json({ token });
  next();
});

app.listen(PORT, () => {
  console.log('Online');
});
