import dotenv from "dotenv"
import express from "express"
dotenv.config()
import cookieParser from "cookie-parser";
import Redis from "ioredis"
import cors from "cors"
const serviceUri = process.env.AIVEN_REDIS_URL
const redisSubscriber = new Redis(serviceUri);
const redisPublisher = new Redis(serviceUri);
import connectToMongodb from "../server/db/connectToMongodb.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import userRoutes from "./routes/user.route.js"
import { app, server } from "./socket/socket.js";


const PORT = process.env.PORT || 8001;
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

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/users",userRoutes)
server.listen(PORT, () => {
  connectToMongodb();
  console.log(`Server is running at http://localhost:${PORT}`);
});
