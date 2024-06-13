import React from 'react'

const Message = ({messageFrom}) => {
    console.log(messageFrom)
  return (
        <div className={`message ${messageFrom}`}>
        HI
    </div>
  )
}

export default Message