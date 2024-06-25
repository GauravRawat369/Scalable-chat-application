import UserChat from "../main-page/UserChat.jsx"
import UserPage from "../main-page/UserPage.jsx"

function Chatpage() {
 
  return (
    <div className="App">
      <div className="chat-main-page">
        <UserPage/>
        <UserChat/>
      </div>
      
    </div>
  );
}

export default Chatpage;


