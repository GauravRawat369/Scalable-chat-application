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
import Message from "../Components/Message";

let socket;

function Chatpage() {
  const { logout } = useLogout();
  const {selectedConversation,setSelectedConversation} =useConversation();
  const { loading, conversations } = useGetConversations();
  const {authUser} = useAuthContext()

  useEffect(()=>{

    return ()=>setSelectedConversation(null)
  },[])
  // useEffect(() => {
  //   if (authUser) {
  //     socket = io("http://localhost:3000", {
  //       transports: ["websocket"],
  //     });

  //     socket.on("connect", () => {
  //       console.log("Connected with ID:", socket.id);
  //       socket.emit("username", authUser.username);
  //     });

  //     socket.on("onlineClients", (clients) => {
  //       setOnlineIds(clients);
  //     });

  //     socket.on("online", (userId) => {
  //       setOnlineIds(prev => {
  //         if (!prev.includes(userId)) {
  //           return [...prev, userId];
  //         }
  //         return prev;
  //       });

  //     });

  //     socket.on("offline", (userId) => {
  //       setOnlineIds(prev => prev.filter(id => id !== userId));
  //     });

  //     socket.on("message", (data) => {
  //       setMessages(prevMessages => [...prevMessages, data]);
  //       console.log("Received message:", data);
  //     });

  //     return () => {
  //       socket.off("connect");
  //       socket.off("onlineClients");
  //       socket.off("online");
  //       socket.off("offline");
  //       socket.off("message");
  //       socket.disconnect();
  //     };
  //   }
  // }, [authUser, authUser.username]);

  // const handleSubmit = () => {
  //   if (message.trim() !== '' && selectedUser) {
  //     const msgPayload = {
  //       sender_name : authUser.username,
  //       to: selectedUser,
  //       from: socket.id,
  //       message
  //     };
  //     socket.emit("message", msgPayload);
  //     setMessages(prevMessages => [...prevMessages, msgPayload]);
  //     setMessage("");
  //   }
  // };

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
              <Bar design="Header" startContent={selectedConversation&&(<Avatar style={{padding:"5px"}}><img src={selectedConversation?.profileimg}/></Avatar>)} endContent={selectedConversation&&(<Avatar style={{padding:"5px"}}><img src={authUser?.profileimg}/></Avatar>)}>
                <Label style={{ fontWeight: "600" }}>
                 {selectedConversation ? (`Chat between ${selectedConversation?.username} and ${authUser?.username}`) : ("No one is Selected")}
                </Label>
              </Bar>
            }
            style={{
              height: "100%"
            }}
          >
            {!selectedConversation ? (
                <IllustratedMessage
                subtitle={{}}
                subtitleText="No one is Selected"
                titleText="Select someone to send message"
              />
            ):(
              <>
              <Message messageFrom = "sender"/>
              <Message messageFrom = "receiver"/>
              </>
            )}
            
          </Page>
          <div className="input-semd-button-div">
          <TextArea
          onChange={function _a(){}}
          onInput={function _a(){}}
          onScroll={function _a(){}}
          onSelect={function _a(){}}
          valueState="None"
          style={{marginBottom:"50px",marginRight:"4px",marginLeft:"4px"}}
          growing
          rows={1}
        />
        <Button style={{width:"100px"}}>Send</Button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Chatpage;
