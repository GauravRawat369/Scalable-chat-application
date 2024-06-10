import UserModel from "../models/User.model.js";

export const getUser = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id;
        const allUsersExceptUs = await UserModel.find({ _id : { $ne: loggedInUserId}});
        res.status(200).json(allUsersExceptUs)
    } catch (error) {
        console.log("Error in getUser controller : ",error.message);
        res.status(500).json({error: "Internal server error"})
    }
}