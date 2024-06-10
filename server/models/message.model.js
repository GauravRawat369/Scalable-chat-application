import mongoose from "mongoose";

const meaageSchema = new mongoose.Schema({
    senderId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
        required: true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
        required: true,
    },
    message:{
        type: String,
        required: true,
    }
},{timestamps:true});

const messageModel = mongoose.model("message",meaageSchema)
export default messageModel;