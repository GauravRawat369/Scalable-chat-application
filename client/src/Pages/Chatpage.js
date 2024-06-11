import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import useLogout from '../hooks/useLogout';
let socket;

function Chatpage() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineIds, setOnlineIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const {logout} = useLogout()

  useEffect(() => {
    if (user) {
      socket = io("http://localhost:3000", {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Connected with ID:", socket.id);
        socket.emit("username", username);
      });

      socket.on("onlineClients", (clients) => {
        setOnlineIds(clients);
      });

      socket.on("online", (userId) => {
        setOnlineIds(prev => {
          if (!prev.includes(userId)) {
            return [...prev, userId];
          }
          return prev;
        });
        
      });

      socket.on("offline", (userId) => {
        setOnlineIds(prev => prev.filter(id => id !== userId));
      });

      socket.on("message", (data) => {
        setMessages(prevMessages => [...prevMessages, data]);
        console.log("Received message:", data);
      });

      return () => {
        socket.off("connect");
        socket.off("onlineClients");
        socket.off("online");
        socket.off("offline");
        socket.off("message");
        socket.disconnect();
      };
    }
  }, [user, username]);

  const handleSubmit = () => {
    if (message.trim() !== '' && selectedUser) {
      const msgPayload = {
        sender_name : username,
        to: selectedUser,
        from: socket.id,
        message
      };
      socket.emit("message", msgPayload);
      setMessages(prevMessages => [...prevMessages, msgPayload]);
      setMessage("");
    }
  };

  return (
    <div className="App">
      {!user ? (
        <div>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <button onClick={() => setUser(true)}>Send</button>
          <div className="logout-buttom">
            <button onClick={logout}>Logout button</button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3>Online Users:</h3>
            {onlineIds.map((id) => (
              <h3 key={id} onClick={() => setSelectedUser(id)}>{id}</h3>
            ))}
          </div>
          {selectedUser && (
            <>
              <input 
                type="text" 
                placeholder="Message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
              />
              <button onClick={handleSubmit}>Send</button>
            </>
          )}
          <div>
            <h3>Messages:</h3>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{msg.sender_name}:{msg.from}:{msg.message}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Chatpage;
