import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userdata",
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message",
            default:[],
        }
    ]
},{timestamps:true});

const conversationModel = mongoose.model("conversation",conversationSchema);
export default conversationModel;
