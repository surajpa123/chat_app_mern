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
const SingleChat = ({ currentUser, selectedChat, setSelectedChat }) => {
  console.log(currentUser, "currentUser");

  const [userChats, setUserChats] = useState();

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [newMessage, setNewMessage] = useState([]);

  console.log(selectedChat, "selectedChat");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (currentUser && selectedChat) {
      setUserChats(currentUser);
    }
  }, [selectedChat]);

  const sendMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/message",
        {
          content: newMessage,
          chatId: selectedChat?._id,
        },
        config
      );

      setNewMessage("");

      console.log("Message sent successfully", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
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

      console.log(data, "messages");
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <div>
      {selectedChat?.isGroupChat ? (
        <>
          <div className="border border-red-600 text-center text-lg">
            <h1>{selectedChat?.chatName?.toUpperCase()}</h1>
          </div>
        </>
      ) : userChats ? (
        getSender(userChats, selectedChat?.users)
      ) : (
        <h1>Click on user to start chatting</h1>
      )}

      <div className="border w-full">
        {
          <>
            <div className="absolute bottom-32 overflow-y-auto w-2/3">
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

            <div className="border absolute bottom-0 w-2/3 m-auto">
              <ChatBox
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
              />
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default SingleChat;
