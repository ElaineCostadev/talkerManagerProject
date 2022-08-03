const express = require('express');
const bodyParser = require('body-parser');

// meus codigos
const fs = require('fs').promises;
const generateToken = require('./generateToken');

const { validationEmailUser } = require('./validationUser');
const { validationPasswordlUser } = require('./validationUser');
const validationToken = require('./validationToken');
const validationName = require('./validationName');
const validationAge = require('./validationAge');
const validationTalk = require('./validationTalk');
const validationWatchedAt = require('./validationWatchedAt');
const validationRate = require('./validationRate');

async function readTalker() {
  const talkerList = await fs.readFile('./talker.json', 'utf-8');
  return JSON.parse(talkerList);
}

async function writeTalker(list) {
   await fs.writeFile('./talker.json', JSON.stringify(list));
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
  return res.status(200).json(talkers);
});

app.get('/talker/search', validationToken, async (req, res) => {
  const { q } = req.query;
  console.log(q);
  const readTalkerAgain = await readTalker();

  if (!q) {
    const talkers = await readTalker();
    return res.status(200).json(talkers); 
  }
  const filterName = readTalkerAgain.filter((talker) => talker.name.includes(q));
  if (!filterName) {
    return res.status(200).json([]);
  }
  return res.status(200).json(filterName);
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
  return res.status(200).json(findTalker);
});

app.post('/login', validationEmailUser, validationPasswordlUser, (_req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.use(validationToken);

app.post('/talker', validationName, validationAge, validationTalk,
validationWatchedAt, validationRate, async (req, res) => {
  const readTalkerAgain = await readTalker();// salvei o meu objeto em uma variavel
  const lastTalker = readTalkerAgain[readTalkerAgain.length - 1]; // encontrando o ultimo elemento do array
  const addId = lastTalker.id + 1; // dentro do ultimo ID encontrado incrementando o valor
  req.body.id = addId; // acrescento a chave ao objeto com o novo numero do id
  readTalkerAgain.push(req.body);
  await writeTalker(readTalkerAgain);
  return res.status(201).json(req.body); 
});

app.put('/talker/:id', validationName, validationAge, validationTalk,
validationWatchedAt, validationRate, async (req, res) => {
  const { id } = req.params;
  const readTalkerAgain = await readTalker();
  const findTalker = readTalkerAgain.find((talker) => talker.id === +id);
  if (!findTalker) {
    return res.status(400).json({ message: 'Talker não encontrado ' });
  }
  req.body.id = findTalker.id;
  // readTalkerAgain[findTalker] =
  // const test = { ...readTalkerAgain[findTalker], ...findTalker.id, newBody };

  readTalkerAgain.push(req.body);
  await writeTalker(readTalkerAgain);
  return res.status(200).json(req.body); 
});

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const readTalkerAgain = await readTalker();
  const findTalker = readTalkerAgain.find((talker) => talker.id === +id);
  if (!findTalker) {
    return res.status(400).json({ message: 'Talker não encontrado ' });
  }
  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
  readTalkerAgain.splice(findTalker);
  await writeTalker(readTalkerAgain);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
