import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import MyChats from "../Components/MyChats";

const Home = ({ currentUser, setSelectedChat, selectedChat }) => {
  const navigate = useNavigate();

  const [chats, setChats] = useState();

  const handleChat = (user) => {
    navigate("/chat", { state: { recipient: user } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentUser={currentUser}
        onUserSelect={handleChat}
        setSelectedChat={setSelectedChat}
      />
     
     <MyChats
          chats={chats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setChats={setChats}
        />
     
    </div>
  );
};

export default Home;
