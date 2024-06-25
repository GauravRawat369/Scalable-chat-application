
import React, { useState, useEffect } from 'react';
import { Button, Bar, Label, IllustratedMessage, TextArea, Avatar } from "@ui5/webcomponents-react";
import useSendMessages from "../hooks/useSendMessages";
import useConversation from '../zustand/useConversation';
import { useAuthContext } from '../context/AuthContext';

import { useListenMessage } from '../hooks/useListenMessage';
import ChatMessageContainer from '../Components/ChatMessageContainer ';

const UserChat = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useSendMessages();
  const { authUser } = useAuthContext();
  useListenMessage();
  
  const { selectedConversation, setSelectedConversation } = useConversation();
  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };
  
  return (
    <div className="chat-page">
      <div className='chat-page-header'>
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
      </div>
      <div className="chat-page-message">
      {!selectedConversation ? (
          <IllustratedMessage
            subtitleText="No one is Selected"
            titleText="Select someone to send a message"
          />
        ) : (
          <ChatMessageContainer message = {message}/>
        )}
      </div>
      <div className="input-send-button-div">
        <TextArea
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          style={{ flex: 1, marginBottom: "50px", marginRight: "4px", marginLeft: "4px" }}
          growing
          placeholder="Send a message"
          rows={1}
        />
        <Button style={{ width: "100px" }} onClick={handleSubmit}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default UserChat;


