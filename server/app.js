require('dotenv').config()
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Redis } = require('ioredis');

const PORT =  process.env.PORT || 3000;
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

io.on('connection', (socket) => {
  console.log(`A new user is connected: ${socket.id}`);
  
  socket.emit('onlineClients', onlineClients.filter(id => id !== socket.id));

  socket.broadcast.emit('online', socket.id);

  onlineClients.push(socket.id);

  socket.on('message', (data) => {
    const { sender_name,to, from, message } = data;
    io.to(to).emit('message', { sender_name,from, message });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    onlineClients = onlineClients.filter(id => id !== socket.id);
    io.emit('offline', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

