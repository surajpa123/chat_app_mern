import axios from "axios";
import React, { useEffect, useState } from "react";

const MyChats = ({
  selectedChat,
  setSelectedChat,
  currentUser,
  setChats,
  chats,
}) => {
  const [chatList, setChatList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [createGroupChatModal, setcreateGroupChatModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [groupChatDetails, setGroupChatDetails] = useState(null);

  const token = localStorage.getItem("token");

  const accessChat = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChatList(data);
    } catch (error) {
      console.log("error", error);
      setError("Failed to load chats. Please try again later.");
    }
  };

  const createGroupChat = async () => {
    if (!groupName || selectedUsers.length === 0) {
      setError("Group name and at least one user are required.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const body = {
        name: groupName,
        users: JSON.stringify(selectedUsers.map((user) => user._id)),
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group",
        body,
        config
      );

      accessChat();
      setShowModal(false);
      setGroupName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
      setError("");

      console.log(data, "new group chat");
    } catch (error) {
      console.log("error", error);
      setError("Failed to create group chat. Please try again later.");
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return setSearchResult([]);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/user/allusers?search=${query}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      console.log("error", error);
      setError("Failed to search users. Please try again later.");
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleRemoveUserFromGroup = async (userId, chatId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const body = {
        chatId: chatId,
        userId: userId,
      };

      await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        body,
        config
      );

      setGroupChatDetails({
        ...groupChatDetails,
        users: groupChatDetails.users.filter((user) => user._id !== userId),
      });

      accessChat();
    } catch (error) {
      console.log("error", error);
      setError("Failed to remove user from group. Please try again later.");
    }
  };

  const handleOpenGroupChatDetails = (chat) => {
    setGroupChatDetails(chat);
    setShowModal(true);
  };

  const handleLeaveGroup = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const body = {
        chatId: chatId,
        userId: currentUser._id,
      };

      await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        body,
        config
      );

      setShowModal(false);
      accessChat();
    } catch (error) {
      console.log("error", error);
      setError("Failed to leave group. Please try again later.");
    }
  };

  const handleGroupAdd = async (user, groupChatDetails) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      console.log(user, groupChatDetails, "uuuu");

      const body = {
        chatId: groupChatDetails?._id,
        userId: user?._id,
      };

      await axios.put("http://localhost:5000/api/chat/groupadd", body, config);

      setShowModal(false);
      setSearchResult([]);
      accessChat();
    } catch (error) {
      console.log("error", error);
      setError("Failed to leave group. Please try again later.");
    }
  };

  useEffect(() => {
    accessChat();
    setSearchResult([]);
    setSearch("");
  }, [selectedChat, chats]);

  return (
    <div className="w-1/4 p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">My Chats</h2>
        <button
          onClick={() => setcreateGroupChatModal(true)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Create Group Chat
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {chatList.length > 0 ? (
        <ul>
          {chatList
            .filter((chat) =>
              chat.users.some((user) => user?._id !== currentUser?._id)
            )
            .map((chat) => {
              const otherUser = chat.users.find(
                (user) => user?._id !== currentUser?._id
              );
              return (
                <li
                  key={chat?._id}
                  className="p-2 mb-2 border rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => chat.isGroupChat && setSelectedChat(chat)}
                >
                  {chat.isGroupChat ? (
                    <div className="flex justify-between">
                      <span>{chat?.chatName}</span>
                      <span onClick={() => handleOpenGroupChatDetails(chat)}>
                        {"View"}
                      </span>
                    </div>
                  ) : (
                    <div onClick={()=> setSelectedChat(chat)} className="flex items-center">
                      <img
                        src={otherUser?.picture}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{otherUser?.name}</span>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      ) : (
        <p>No chats available</p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-4 w-1/3 z-10">
            <>
              <h3 className="text-lg font-bold mb-2">
                {groupChatDetails.chatName}
              </h3>
              <div className="mb-4">
                <div className="border flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Group Members
                  </label>

                  <div className="">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Add new users"
                    />
                    <ul className="mt-2 max-h-40 overflow-y-auto">
                      {searchResult?.map((user) => (
                        <li
                          key={user._id}
                          className="flex items-center p-2 border-b cursor-pointer"
                          onClick={() => handleSelectUser(user)}
                        >
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span>{user.name}</span>

                          <div
                            onClick={() =>
                              handleGroupAdd(user, groupChatDetails)
                            }
                            className=" w-20 text-center"
                          >
                            <span className="ml-auto text-green-500">
                              Add user
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <ul className="mt-2 max-h-40 overflow-y-auto">
                  {groupChatDetails?.users.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center p-2 border-b"
                    >
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{user.name}</span>
                      <button
                        onClick={() =>
                          handleRemoveUserFromGroup(
                            user._id,
                            groupChatDetails._id
                          )
                        }
                        className="ml-auto text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleLeaveGroup(groupChatDetails._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Leave Group
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </>
          </div>
        </div>
      )}

      {createGroupChatModal && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="bg-white rounded-lg p-4 w-1/3 z-10">
              <h3 className="text-lg font-bold mb-2">Create Group Chat</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter group chat name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Search Users
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search for users"
                />
                <ul className="mt-2 max-h-40 overflow-y-auto">
                  {searchResult.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center p-2 border-b cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{user.name}</span>
                      {selectedUsers?.includes(user) && (
                        <span className="ml-auto text-green-500">Selected</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap mb-4">
                {selectedUsers?.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center mr-2 mb-2 p-1 bg-blue-200 rounded"
                  >
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-6 h-6 rounded-full mr-1"
                    />
                    <span>{user.name}</span>
                    <button
                      onClick={() => handleSelectUser(user)}
                      className="ml-1 text-red-500"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setcreateGroupChatModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Close
                </button>
                <button
                  onClick={createGroupChat}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyChats;
