const app = require('express')();
const express = require('express');
import fetch from 'node-fetch';

const response = await fetch(
  'https://api.retail-vr.com/_plugin/kuzzle-app/auth/me'
);
const body = await response.text();

console.log(body);
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: { origin: '*' },
});
var geoip = require('geoip-lite');

const port = process.env.PORT || 3000;
const router = express.Router();

router.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var geo = geoip.lookup(ip);
  console.log('connection from :', geo);
});

app.use('/', router);

io.on('connection', (socket) => {
  console.log('a user connected');
  // const address = socket.request.connection.remoteAddress;
  const ip = socket.request.headers['x-forwarded-for'];
  const geo = geoip.lookup(ip);
  console.log(geo);
  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(port, () => {
  setInterval(() => {
    const response = await fetch(
      'https://api.retail-vr.com/_plugin/kuzzle-app/auth/me'
    );
    const body = await response.text();
    console.log(' --->', body);
  }, 1000);
});
