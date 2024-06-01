import React, { useEffect, useState } from "react";
import {
  getSender,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/getSender";
import ChatBox from "./ChatBox";
import axios from "axios";
import { Avatar } from "./Avatar";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ currentUser, selectedChat, setSelectedChat }) => {
  console.log(currentUser, "currentUser");

  const [userChats, setUserChats] = useState();

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [newMessage, setNewMessage] = useState([]);

  const [socketConnected, setSocketConnected] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (currentUser && selectedChat) {
      setUserChats(currentUser);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket?.emit("setup", currentUser);
    socket?.on("connection", () => {
      setSocketConnected(true);
    });
  }, []);

  const sendMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "http://localhost:5000/api/message",
        {
          content: newMessage,
          chatId: selectedChat?._id,
        },
        config
      );
      console.log(data, "datadata");
      socket.emit("newMessage", data);
      setMessages([...messages, data]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat?._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("joinChat", selectedChat?._id);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("messageReceived", (newMessageRecieved) => {
      console.log(newMessageRecieved, "newMessageRecieved");
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <div>
      {selectedChat?.isGroupChat ? (
        <>
          <div className="border border-red-600 text-center text-lg">
            <h1>{selectedChat?.chatName?.toUpperCase()}</h1>
          </div>
        </>
      ) : userChats ? (
        <p className="text-center p-2">
          {getSender(userChats, selectedChat?.users)}
        </p>
      ) : (
        <h1>Click on user to start chatting</h1>
      )}

      <div className="border w-full flex flex-col">
        {
          <>
            <div className="overflow-y-auto h-[calc(97vh-185px)]  w-full p-4">
              {messages &&
                messages.map((m, i) => (
                  <div
                    className="items-center gap-2"
                    style={{ display: "flex" }}
                    key={m._id}
                  >
                    {(isSameSender(messages, m, i, currentUser._id) ||
                      isLastMessage(messages, i, currentUser._id)) && (
                      <p className="mt-2">
                        <Avatar name={m.sender.name[0]} />
                      </p>
                    )}
                    <span
                      style={{
                        backgroundColor: `${
                          m.sender._id === currentUser._id
                            ? "#BEE3F8"
                            : "#B9F5D0"
                        }`,
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          currentUser._id
                        ),
                        marginTop: isSameUser(messages, m, i, currentUser._id)
                          ? 3
                          : 10,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                      }}
                    >
                      {m.content}
                    </span>
                  </div>
                ))}
            </div>
          </>
        }
        <div className="border w-full m-auto">
          <ChatBox
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleChat;
