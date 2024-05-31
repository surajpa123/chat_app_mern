import axios from "axios";
import React, { useEffect, useState } from "react";

const MyChats = ({
  selectedChat,
  setSelectedChat,
  currentUser,
  setChats,
  chats,
}) => {
  const [loggedUser, setLoggedUser] = useState();

  const acessChat = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
       
        config
      );

      console.log(data,'data')
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(()=>{
    acessChat()
  },[])

  return <div className="border border-red-600 w-1/4">MyChats</div>;
};

export default MyChats;
