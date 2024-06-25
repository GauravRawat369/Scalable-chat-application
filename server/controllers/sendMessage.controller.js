import conversationModel from "../models/conversation.model.js"
import messageModel from "../models/message.model.js"
import { getReceiverSocketId ,io,redisPublisher } from "../socket/socket.js";
export const sendMessage = async(req,res)=>{
    try {
        const {message} = req.body;
        console.log(message)
        const {id : receiverId }  = req.params;//receiver id
        const senderId = req.user._id;//from middleware from cookies

        let conversation = await conversationModel.findOne({
            participants : {$all: [senderId,receiverId]}
        })
        if(!conversation)
        {
            conversation = await conversationModel.create({
                participants : [senderId,receiverId],
            })
        }
        const newMessage = new messageModel({
            senderId: senderId,
            receiverId: receiverId,
            message: message,
        })
        if(newMessage)
        {
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([conversation.save(),newMessage.save()])


        //socket functionallity
        const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			// io.to(receiverSocketId).emit("newMessage", newMessage);
            redisPublisher.publish("newMessage", JSON.stringify({ receiverSocketId, newMessage }));
		}

		res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller :",error.message);
        res.status(500).json({error: "Internal server error"})
    }
}