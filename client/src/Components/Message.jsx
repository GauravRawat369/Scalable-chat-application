import React from 'react'
import { useAuthContext } from '../context/AuthContext'

const Message = ({message}) => {
  console.log(message)
  const {authUser} = useAuthContext();
  const messageFrom = authUser._id === message.senderId ? "sender" : "receiver";
  console.log(messageFrom)
  return (
        <div className={`message ${messageFrom}`}>
        {message.message}
    </div>
  )
}

export default Message