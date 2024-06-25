// import dotenv from "dotenv"
// dotenv.config()
// import { Server } from "socket.io";
// import Redis from "ioredis"
// const serviceUri = process.env.AIVEN_REDIS_URL
// const redisSubscriber = new Redis(serviceUri);
// const redisPublisher = new Redis(serviceUri);
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);

// const io = new Server(server , {
//     cors: {
//         origin: ["http://localhost:3000","http://localhost:3001"],
//         methods: ["GET", "POST"]
//     }
// })
// export const getReceiverSocketId = (receiverId) => {
// 	return userSocketMap[receiverId];
// };
// const userSocketMap = {} 
// redisSubscriber.on('message', (channel, msg) => {
//     console.log(`Received message from ${channel}: ${msg}`);
//     switch (channel) {
//       case 'getOnlineUsers':
//         io.emit("getOnlineUsers",msg)
//         break;
//       case 'newMessage':
//         const { receiverSocketId,newMessage} = msg;
//         // io.to(onlineClients[to]).emit('newMessage', { to, from, message });
//         io.to(receiverSocketId).emit("newMessage", newMessage);
//         break;
//       default:
//         break;
//     }
//   });
  
//   redisSubscriber.subscribe('getOnlineUsers', 'newMessage');
// io.on("connection",(socket)=>{
//     console.log("A user is connected : " , socket.id);
//     const userId = socket.handshake.query.userId;
//     if(userId != "undefined")
//     {
//         userSocketMap[userId] = socket.id;
//     }
//     // io.emit("getOnlineUsers",Object.keys(userSocketMap))
//     redisPublisher.publish("getOnlineUsers",Object.keys(userSocketMap))
//     socket.on("disconnect",()=>{
//         console.log("disconnected user is : ",socket.id);
//         delete userSocketMap[userId];
//         // io.emit("getOnlineUsers",Object.keys(userSocketMap))
//         redisPublisher.publish("getOnlineUsers",Object.keys(userSocketMap))
//     })
// });

// export { app , io , server ,redisPublisher};


import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import Redis from "ioredis";
import http from "http";
import express from "express";

const serviceUri = process.env.AIVEN_REDIS_URL;
const redisSubscriber = new Redis(serviceUri);
const redisPublisher = new Redis(serviceUri);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

redisSubscriber.on('message', (channel, msg) => {
    console.log(`Received message from ${channel}: ${msg}`);
    switch (channel) {
        case 'getOnlineUsers':
            io.emit("getOnlineUsers", msg);
            break;
        case 'newMessage':
            const { receiverSocketId, newMessage } = JSON.parse(msg);
            io.to(receiverSocketId).emit("newMessage", newMessage);
            break;
        default:
            break;
    }
});

redisSubscriber.subscribe('getOnlineUsers', 'newMessage');

io.on("connection", (socket) => {
    console.log("A user is connected: ", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }
    // Convert the array to a JSON string before publishing
    redisPublisher.publish("getOnlineUsers", JSON.stringify(Object.keys(userSocketMap)));

    socket.on("disconnect", () => {
        console.log("disconnected user is: ", socket.id);
        delete userSocketMap[userId];
        // Convert the array to a JSON string before publishing
        redisPublisher.publish("getOnlineUsers", JSON.stringify(Object.keys(userSocketMap)));
    });
});

export { app, io, server, redisPublisher };
