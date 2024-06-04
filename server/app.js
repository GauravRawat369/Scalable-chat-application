// require('dotenv').config()
// const express = require('express');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const redis = require('redis');

// const PORT =  process.env.PORT || 3000;
// const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// let onlineClients = [];



// io.on('connection', (socket) => {
//   console.log(`A new user is connected: ${socket.id}`);
// ;

//   socket.emit('onlineClients', onlineClients.filter(id => id !== socket.id));
//   socket.broadcast.emit('online', socket.id);
//   onlineClients.push(socket.id);

//   socket.on('message', (data) => {
//     const { sender_name,to, from, message } = data;
//     io.to(to).emit('message', { sender_name,from, message });
//   });

//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.id}`);
//     onlineClients = onlineClients.filter(id => id !== socket.id);
//     io.emit('offline', socket.id);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Redis = require("ioredis");

const serviceUri = process.env.AIVEN_REDIS_URL
const redisSubscriber = new Redis(serviceUri);
const redisPublisher = new Redis(serviceUri);

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let onlineClients = [];

redisSubscriber.on('message', (channel, msg) => { // Changed 'message' to 'msg'
  console.log(`Received message from ${channel}: ${msg}`);
  switch (channel) {
    case 'onlineClients':
      io.emit('onlineClients', JSON.parse(msg));
      break;
    case 'online':
      io.emit('online', msg);
      onlineClients.push(msg);
      break;
    case 'message':
      const { sender_name, to, from, message } = JSON.parse(msg);
      io.to(to).emit('message', { sender_name, from, message });
      break;
    case 'offline':
      io.emit('offline', msg);
      break;
    default:
      break;
  }
});


redisSubscriber.subscribe('onlineClients', 'online', 'message', 'offline');

io.on('connection', (socket) => {
  console.log(`A new user is connected: ${socket.id}`);

  redisPublisher.publish('onlineClients', JSON.stringify(onlineClients.filter(id => id !== socket.id)));
  redisPublisher.publish('online', socket.id);

  socket.on('message', (data) => {
    redisPublisher.publish('message', JSON.stringify(data));
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    onlineClients = onlineClients.filter(id => id !== socket.id);
    redisPublisher.publish('offline', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
