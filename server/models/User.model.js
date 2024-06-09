import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    mail:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        require: true,
    },
    profileimg:{
        type: String,
        default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
    }
})
const UserModel = mongoose.model("UserData",userSchema);
export default UserModel;