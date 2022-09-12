const { KeyManager } = require('@carlosski/keystate');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({
  origin: '*'
}))

const keyManager = new KeyManager(60000, path.resolve(__dirname, '__state__'));

app.get('/key/new', (req, res) => {
  const key = keyManager.addKey();
  res.json({
    status: 200,
    key
  });
})

app.get('/key/:key', (req, res) => {
  const key = req.params.key;
  const expired = keyManager.isExpired(key);
  res.json({
    status: 200,
    expired
  });
})

setInterval(keyManager.removeExpired, 60000);

app.listen(3000, () => {
  console.log('Listening on port 3000');
})