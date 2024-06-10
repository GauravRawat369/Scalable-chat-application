import UserModel from "../models/User.model.js";
import generateToken from "../utils/generateToken.utils.js"
import bcrypt from "bcrypt"
export const signup = async (req,res) =>{
    try {
        const {username,email,gender,password} = req.body;
        const user = await UserModel.findOne({username});
        if(user)
        {
            return res.status(400).json({error:"Username already exists"});
        }

        //use bycrypt to 
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const profileimgBoy = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const profileimgGirl = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new UserModel({
            username : username,
            email :email,
            password:hashPassword,
            gender:gender,
            profileimg: gender === "Female" ? profileimgGirl : profileimgBoy
        })

       if(newUser)
        {
            //generate jwt  from utils
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(200).json({
                    _id : newUser._id,
                    username : newUser.username,
                    profileimg : newUser.profileimg
            })
        }
        else
        {
            res.status(200).json({error:"Invalid data"})
        }
    } catch (error) {
        console.log("Error in signup controller",error.message)
        res.status(500).json({error : " Internal server error"})
    }
}
export const login =async (req,res)=>{
    try {
        const {username,email,password} = req.body;
        const user = await UserModel.findOne({username});
        if(user)
        {
            if(bcrypt.compareSync(password, user.password))
            {
                generateToken(user._id, res);
                res.status(200).json({
                    _id : user._id,
                    username : user.username,
                    profileimg : user.profileimg
                })
            }
            else
            {
                res.status(400).json({error:"Invalid username or password"})
            }
        }
    } catch (error) {
        console.log("Error in login controller",error.message)
        res.status(500).json({error : " Internal server error"})
    }
}
export const logout =async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({error : " Internal server error"})
    }
}