import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import useLogout from "../hooks/useLogout";
import { UserConversation } from "../Components/UserConversation";
import useGetConversations from "../hooks/useGetConversations";
import { Page, Button, Bar, Label,IllustratedMessage ,TextArea, Avatar } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/home.js";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";
import Message from "../Components/Message.jsx";
import useSendMessages from "../hooks/useSendMessages";
import useGetMessages from "../hooks/useGetMessages";


function Chatpage() {
  const { logout } = useLogout();
  const [socket,setSocket] = useState(null);
  const {selectedConversation,setSelectedConversation} = useConversation();
  const {sendMessage} = useSendMessages();
  const { loading, conversations } = useGetConversations();
  const {messages: chatmessages} = useGetMessages();
  const {authUser} = useAuthContext()
  const [chats,setChats] = useState("")
  const [message,setMessage] = useState()
  const [onlineIds,setOnlineIds] = useState({})
console.log(chatmessages)
  useEffect(()=>{

    return ()=>setSelectedConversation(null)
  },[setSelectedConversation])
  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:8000", {
        transports: ["websocket"],
      });
      setSocket(socket);

      socket.on("connect", () => {
        console.log("Connected with ID:", socket.id);
        socket.emit("authUser", authUser._id);
      });

      socket.on("onlineClients", (clients) => {
        setOnlineIds(clients);
      });

      socket.on("online", (user) => {
        setOnlineIds(prev => ({
          ...prev,
          [user.authId]: user.socketId
        }));
      });

      socket.on("offline", (socketId) => {
        setOnlineIds(prev => {
          const newClients = { ...prev };
          for (const authId in newClients) {
            if (newClients[authId] === socketId) {
              delete newClients[authId];
            }
          }
          return newClients;
        });
        console.log("someone is desconnected",onlineIds)
      });

      socket.on("message", (data) => {
        setChats(prevMessages => [...prevMessages, data]);
        console.log("Received message:", data);
      });

      return () => {
        socket.off("connect");
        socket.off("onlineClients");
        socket.off("online");
        socket.off("offline");
        socket.off("message");
        socket.disconnect();
      };
    }
  }, [authUser]);
//problem is that ourId is not updated
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(message.trim() === '')return;
    await sendMessage(message);
    setMessage("");
    // if (!selectedConversation || !selectedConversation._id) {
    //   console.error("Selected conversation or its ID is not defined.");
    //   return;
    // }
    // if (message.trim() !== '') {
    //   console.log("Online IDs:", onlineIds);
    //   console.log("Selected Conversation ID:", selectedConversation._id);
    //   const selectedUserSocketId = onlineIds[selectedConversation._id];
    //   console.log("Selected User Socket ID:", selectedUserSocketId);
      
      
    //   const msgPayload = {
    //     to: selectedUserSocketId,
    //     from: socket.id,
    //     message,
    //   };

    //   console.log('Message Payload:', msgPayload);
      
    //   if (!msgPayload.to || !msgPayload.from) {
    //     console.error("One of the IDs in the payload is undefined.");
    //     return;
    //   }

    //   socket.emit("message", msgPayload);
    //   setChats(prevMessages => [...prevMessages, msgPayload]); 
    //   setMessage("");
    // }
  };


  // console.log(onlineIds);
// console.log(chats)


  return (
    <div className="App">
      <button onClick={logout}>Logout Button</button>
      <div className="chat-main-page">
        <div className="conversation-sidebar">
          <Page
            backgroundDesign="Transparent"
            style={{
              height: "95%",
              width: "350px",
            }}
          >
            <div className="conversation-div">
              {conversations.map((conversation) => (
                <UserConversation
                  key={conversation._id}
                  conversation={conversation}
                />
              ))}
            </div>
          </Page>
        </div>
        <div className="chat-page">
          <Page
            backgroundDesign="Transparent"
            header={
              <Bar
                design="Header"
                startContent={
                  selectedConversation && (
                    <Avatar style={{ padding: "5px" }}>
                      <img src={selectedConversation?.profileimg} alt="Profile" />
                    </Avatar>
                  )
                }
                endContent={
                  selectedConversation && (
                    <Avatar style={{ padding: "5px" }}>
                      <img src={authUser?.profileimg} alt="Profile" />
                    </Avatar>
                  )
                }
              >
                <Label style={{ fontWeight: "600" }}>
                  {selectedConversation
                    ? `Chat between ${selectedConversation?.username} and ${authUser?.username}`
                    : "No one is Selected"}
                </Label>
              </Bar>
            }
            style={{
              height: "100%",
            }}
          >
            {!selectedConversation && (
              <IllustratedMessage
                subtitleText="No one is Selected"
                titleText="Select someone to send a message"
              />
            )}
            {
              chatmessages.length > 0 && (
                chatmessages.map((message) => (
                  <Message key={message._id} message={message} />
                )))
            }
            {chatmessages.length == 0 &&(
              <IllustratedMessage
                subtitleText="No messages"
                titleText="Send a message"
              />
            )}
          </Page>
          <div className="input-send-button-div">
            <TextArea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              style={{ marginBottom: "50px", marginRight: "4px", marginLeft: "4px" }}
              growing
              rows={1}
            />
            <Button style={{ width: "100px" }} onClick={handleSubmit}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatpage;

