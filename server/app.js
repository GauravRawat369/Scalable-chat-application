import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser";
import Redis from "ioredis"
import cors from "cors"
import express from "express";
import {createServer} from "http"
import {Server}  from "socket.io";
const serviceUri = process.env.AIVEN_REDIS_URL
const redisSubscriber = new Redis(serviceUri);
const redisPublisher = new Redis(serviceUri);
import connectToMongodb from "../server/db/connectToMongodb.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import userRoutes from "./routes/user.route.js"


const PORT = process.env.PORT || 8001;
const app = express();
app.use(cookieParser());//to parse the cookies
const corsOptions = {
  origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      return callback(null, origin);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json())//to parse the incomming request with json payloads
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let onlineClients = {};

redisSubscriber.on('message', (channel, msg) => {
  console.log(`Received message from ${channel}: ${msg}`);
  switch (channel) {
    case 'onlineClients':
      io.emit('onlineClients', JSON.parse(msg));
      break;
    case 'online':
      const user = JSON.parse(msg);
      io.emit('online', user);
      onlineClients[user.authId] = user.socketId;
      break;
    case 'message':
      const {  to, from, message } = JSON.parse(msg);
      io.to(onlineClients[to]).emit('message', { to, from, message });
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
  
  socket.on('authUser', (userId) => {
    const user = { authId: userId, socketId: socket.id };
    onlineClients[userId] = socket.id;
    redisPublisher.publish('online', JSON.stringify(user));
    redisPublisher.publish('onlineClients', JSON.stringify(onlineClients));
  });

  socket.on('message', (data) => {
    redisPublisher.publish('message', JSON.stringify(data));
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const authId = Object.keys(onlineClients).find(key => onlineClients[key] === socket.id);
    if (authId) {
      delete onlineClients[authId];
    }
    redisPublisher.publish('offline', socket.id);
    redisPublisher.publish('onlineClients', JSON.stringify(onlineClients));
  });
});
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/users",userRoutes)
server.listen(PORT, () => {
  connectToMongodb();
  console.log(`Server is running at http://localhost:${PORT}`);
});
