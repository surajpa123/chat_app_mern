import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import MyChats from "../Components/MyChats";
import SingleChat from "../Components/SingleChat";

const Home = ({ currentUser, setSelectedChat, selectedChat }) => {
  const navigate = useNavigate();

  const [chats, setChats] = useState();

  const handleChat = (user) => {
    navigate("/chat", { state: { recipient: user } });
  };

  return (
    <div className="min-h-screen w-full">
  <div className="flex flex-col flex-1">
    <Navbar
      currentUser={currentUser}
      onUserSelect={handleChat}
      setSelectedChat={setSelectedChat}
    />
  </div>

  <div className="flex flex-col md:flex-row"> 
    <MyChats
      chats={chats}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      setChats={setChats}
      currentUser={currentUser}
      className="md:w-1/4" 
    />

    <div className="flex-1">
      <SingleChat selectedChat={selectedChat} currentUser={currentUser} />
    </div>
  </div>
</div>

  );
};

export default Home;
