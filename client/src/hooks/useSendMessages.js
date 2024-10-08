import {  useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import useConversation from "../zustand/useConversation";
const useSendMessages = () => {
	const [loading, setLoading] = useState(false);
    const {messages,setMessages,selectedConversation} = useConversation();

	const sendMessage = async (message) => {
        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:8000/api/messages/send/${selectedConversation._id}`,{ message})
            const data = res.data;
            if (data.error) {
                throw new Error(data.error);
            }
            setMessages([...messages,data]);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
	return { loading, sendMessage };
};
export default useSendMessages;