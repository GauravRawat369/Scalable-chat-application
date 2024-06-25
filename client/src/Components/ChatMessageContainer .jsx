import React, { useRef,useEffect } from 'react';
import { IllustratedMessage } from "@ui5/webcomponents-react";
import { Loader } from '@ui5/webcomponents-react';
import useGetMessages from '../hooks/useGetMessages';
import Message from './Message';
const ChatMessageContainer = () => {
  let previousDate = null;
  const { messages,loading } = useGetMessages();
  const lastMessageRef = useRef();
  useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 1)
    
	}, [messages]);
  if(loading)
  return <Loader progress="60%" />
  return (
    <div className="chat-message-container">
      {messages.length > 0 && (
        messages.map((message) => {
          const messageDate = new Date(message.createdAt);
          const isNewDay = previousDate === null || messageDate.getDate() !== previousDate.getDate();

          previousDate = messageDate;

          return (
            <div key={message._id} ref={lastMessageRef}>
              {isNewDay && <div className="message-date">{messageDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
              <Message message={message} />
            </div>
          );
        })
      )}
      {messages.length === 0 && (
        <IllustratedMessage
          subtitleText="No messages"
          titleText="Send a message"
        />
      )}
    </div>
  );
};

export default ChatMessageContainer;
