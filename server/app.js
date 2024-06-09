import dotenv from "dotenv"
dotenv.config()
import Redis from "ioredis"
import express from "express";
import {createServer} from "http"
import {Server}  from "socket.io";
const serviceUri = process.env.AIVEN_REDIS_URL
const redisSubscriber = new Redis(serviceUri);
const redisPublisher = new Redis(serviceUri);
import connectToMongodb from "../server/db/connectToMongodb.js";
import authRoutes from "./routes/auth.route.js"



const PORT = process.env.PORT || 8001;
const app = express();
app.use(express.json())
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

app.use("/api/auth",authRoutes)

server.listen(PORT, () => {
  connectToMongodb();
  console.log(`Server is running at http://localhost:${PORT}`);
});
