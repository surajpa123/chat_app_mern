import React, { useEffect, useState } from "react";
import axios from "axios";

const SearchUser = ({ onUserSelect, currentUser, setSelectedChat }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    const token = localStorage.getItem("token");

    if (e.target.value.length > 0) {
      try {
        const response = await axios.get(
          `${apiUrl}/user/allusers?search=${e.target.value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    if (e.target.value.length == 0) {
      setSearchResults([]);
    }
  };

  useEffect(() => {}, []);

  const acessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/chat`,
        {
          userId,
        },
        config
      );

      setSelectedChat(data);
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="block w-full py-2 pl-3 pr-10 leading-5 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Search users..."
      />
      {searchResults.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm">
          {searchResults.map((user) => (
            <li
              key={user._id}
              onClick={() => acessChat(user?._id)}
              className="flex gap-4 items-center cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-200"
            >
              <img src={user?.picture} className="w-8 h-8" />

              <span className="block truncate">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUser;
