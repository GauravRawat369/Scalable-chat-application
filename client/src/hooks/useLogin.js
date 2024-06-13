import { useState } from "react"
import { useAuthContext } from "../context/AuthContext";
import toast from 'react-hot-toast';
import axios from 'axios';
const useLogin = ()=>{
    const [loading,setLoading] = useState(false);
    const {setAuthUser} = useAuthContext() 
    const login =async ({username,email,password})=>{
        const success = handleInputErrros({username,email,password})
        if(!success)return;
        setLoading(true)
        try {
            const res = await axios.post(`http://localhost:8000/api/auth/login`,{username,email,password})
            const data = res.data;
            if(data.error){
                throw new Error(data.error)
            }
            //setting user data to localStorage
            localStorage.setItem("chat-user",JSON.stringify(data))
            setAuthUser(data)
            console.log(data)
        } catch (error) {
            console.log("Error in useLogin hook : ",error)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {loading,login}
}
export default useLogin;


function handleInputErrros({username,email,password}){
    if(!username || !email || !password)
    {
        toast.error("Please fill all the fields")
        return false;
    }
    return true;
}