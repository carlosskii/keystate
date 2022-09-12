const { KeyManager } = require('@carlosski/keystate');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({
  origin: '*'
}))
app.use(express.json());

const keyManager = new KeyManager(60000, __dirname);

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

app.get('/key/:key/data', (req, res) => {
  const key = req.params.key;
  const success = keyManager.keyfsExec(
    "python3 np.py", key
  );
  if (success) {
    res.send({
      status: 200,
      data: keyManager.keyfsRead(key, "np.txt")
    })
  } else {
    res.send({
      status: 500,
      data: "Script execution failed"
    })
  }
})

app.post('/key/:key/image', (req, res) => {
  const key = req.params.key;
  const { image, name } = req.body;
  try {
    keyManager.keyfsWrite(key, name, Buffer.from(image, 'base64'));
    res.send({
      status: 200
    })
  } catch (e) {
    res.send({
      status: 500,
      error: e.message
    })
  }
})

setInterval(() => {
  keyManager.removeExpired();
}, 60000);

app.listen(4242, () => {
  console.log('Listening on port 4242');
})