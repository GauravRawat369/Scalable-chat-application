import React from 'react'
import {Card,CardHeader} from '@ui5/webcomponents-react';
import useConversation from '../zustand/useConversation';
export const UserConversation = ({conversation}) => {
    const {selectedConversation,setSelectedConversation} = useConversation();
    const isSelected = selectedConversation?._id === conversation._id;
    const handleOnClick=()=>{
        setSelectedConversation(conversation)
    }
  return (
    <div>
        <Card
    header={<CardHeader 
        avatar={<img src={conversation.profileimg}/>} interactive  titleText={conversation.username} onClick={handleOnClick} />}
    style={{
        width: '300px',
        
    }}
    className={isSelected ? 'card-header-clicked' : ''}
    >
    </Card>
    </div>
  )
}
