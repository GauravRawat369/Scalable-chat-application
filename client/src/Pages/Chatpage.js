import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import useLogout from "../hooks/useLogout";
import { UserConversation } from "../Components/UserConversation";
import useGetConversations from "../hooks/useGetConversations";
import { Page, Button, Bar, Label } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/home.js";
import useConversation from "../zustand/useConversation";
import { IllustratedMessage } from '@ui5/webcomponents-react';
import { useAuthContext } from "../context/AuthContext";

let socket;

function Chatpage() {
  const { logout } = useLogout();
  const {selectedConversation} =useConversation();
  const { loading, conversations } = useGetConversations();
  const {authUser} = useAuthContext()
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
              height: "500px",
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
                endContent={<Button icon="settings" title="s" ><a href={selectedConversation.profileimg}></a></Button>}
                startContent={<Button icon="home" title="Go Home" ></Button>}
              >
                <Label style={{ fontWeight: "600" }}>
                 {selectedConversation ? (`Chat between ${selectedConversation?.username} and ${authUser?.username}`) : ("No one is Selected")}
                </Label>
              </Bar>
            }
            style={{
              height: "90vh",
            }}
          >
            {!selectedConversation && (
                <IllustratedMessage
                subtitle={{}}
                subtitleText="No one is Selected"
                titleText="Select someone to send message"
              />
            )}
          </Page>
        </div>
      </div>
    </div>
  );
}

export default Chatpage;
