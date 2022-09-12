const { KeyManager } = require('@carlosski/keystate');
const { KeyFS } = require('@carlosski/keystate-fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mime = require('mime-types');

const app = express();
app.use(cors({
  origin: '*'
}))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
  const fs = new KeyFS(key);
  const success = keyManager.keyfsExec(
    "python3 np.py", key
  );
  if (success) {
    res.send({
      status: 200,
      data: fs.read("np.txt")
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
  const fs = KeyFS(keyManager, key);
  const { image, name } = req.body;
  try {
    fs.writeBinary(name, Buffer.from(image, 'base64'));
    fs.env("image", name);
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


app.get('/key/:key/getimage', (req, res) => {
  const key = req.params.key;
  const fs = KeyFS(keyManager, key);
  try {
    const imageName = fs.env("image");
    const image = fs.readBinary(imageName);
    res.send({
      status: 200,
      name: imageName,
      mime: mime.lookup(imageName),
      image: Buffer.from(image, 'binary').toString('base64')
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