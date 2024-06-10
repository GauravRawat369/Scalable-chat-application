import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
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
        enum:["Male","Female"],
    },
    profileimg:{
        type: String,
        default: ""
    }
},{timestamps:true})
const UserModel = mongoose.model("UserData",userSchema);
export default UserModel;