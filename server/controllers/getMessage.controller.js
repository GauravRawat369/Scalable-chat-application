import conversationModel from "../models/conversation.model.js";

export const getMessage = async(req,res)=>{
    try {
        const {id : userToChatwith} = req.params;
        const senderId = req.user._id; //from middleware from cookies

        const conversation = await conversationModel.findOne({
            participants : {$all: [senderId,userToChatwith]}
        }).populate("messages");
        if(!conversation)
        {
            return res.status(404).json([])
        }
        res.status(200).json(conversation.messages)
    } catch (error) {
        console.log("Error in getMessage controller :",error.message);
        res.status(500).json({error: "Internal server error"})
    }
}