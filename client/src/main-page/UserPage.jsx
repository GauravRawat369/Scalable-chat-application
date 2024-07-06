import React from 'react'
import { UserConversation } from '../Components/UserConversation'
import { Page } from "@ui5/webcomponents-react";
import useGetConversations from '../hooks/useGetConversations';
import { useSocketContext } from '../context/SocketContext';
import useLogout from "../hooks/useLogout.js"
const UserPage = () => {
  const { loading, conversations } = useGetConversations();
  const {onlineUsers} = useSocketContext();
  const { logout } = useLogout();

  const onlineUserIds = onlineUsers;
console.log(onlineUserIds);
const onlineUserDetails = conversations.filter(user => onlineUserIds.includes(user._id));
const offlineUsers = conversations.filter(user => !onlineUserIds.includes(user._id));
const sortedUsers = [...onlineUserDetails, ...offlineUsers];
  // console.log(onlineUserDetails)
  // console.log(sortedUsers)
  return (
    <div className="conversation-sidebar">
          <Page
            backgroundDesign="Transparent"
            style={{
              height: "95%",
              width: "350px",
            }}
          >
            <div className="conversation-div">
              {sortedUsers.map((conversation) => (
                <UserConversation
                  key={conversation._id}
                  conversation={conversation}
                />
              ))}
            </div>
          </Page>
          <button onClick={logout}>Logout Button</button>
        </div>
  )
}
export default UserPage;