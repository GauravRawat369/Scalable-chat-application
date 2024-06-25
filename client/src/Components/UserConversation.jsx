import React from 'react'
import {Card,CardHeader} from '@ui5/webcomponents-react';
import useConversation from '../zustand/useConversation';
import { useSocketContext } from '../context/SocketContext';
export const UserConversation = ({conversation}) => {
    const {selectedConversation,setSelectedConversation} = useConversation();
    const isSelected = selectedConversation?._id === conversation._id;
    const {onlineUsers} = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id)
  return (
    <div>
        <Card
    header={<CardHeader 
        avatar={<img src={conversation.profileimg}/>} interactive  subtitleText={isOnline ? "Online" : ""}  titleText={conversation.username} onClick={()=> setSelectedConversation(conversation)} />}
    style={{
        width: '300px',
        
    }}
    className={isSelected ? 'card-header-clicked' : ''}
    >
    </Card>
    </div>
  )
}
