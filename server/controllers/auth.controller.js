import UserModel from "../models/User.model.js";
export const signup = async (req,res) =>{
    try {
        const {username,mail,gender,password} = req.body;
        const user = UserModel.findOne({username});
        if(user)
        {
            return res.status(400).json({error:"Username already exists"});
        }
    } catch (error) {
        console.log("Error",error)
    }
    res.send("signup route");
}
export const login = (req,res)=>{
    res.send("login route");
}
export const logout = (req,res)=>{
    res.send("logout route");
}