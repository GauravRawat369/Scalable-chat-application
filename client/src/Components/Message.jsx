import React from 'react'
import { useAuthContext } from '../context/AuthContext'

const Message = ({message}) => {
  // console.log(message)
  const {authUser} = useAuthContext();
  const fromMe = authUser._id === message.senderId;
  const messageFrom =  fromMe ? 'sender' : 'receiver';
  // console.log(messageFrom)
  return (
        <div className={`message ${messageFrom}`}>
        {message.message}
        <div className='message-time'>
        {new Date(message.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
      })}
        </div>
    </div>
  )
}

export default Message