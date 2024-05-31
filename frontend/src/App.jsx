import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import { fetchUserData } from "./helper/fetchUser";
import { useEffect, useState } from "react";
import Home from "./pages/Home";

function App() {
  const [userData, setUserData] = useState();

  const [selectedChat, setSelectedChat] = useState();

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log(selectedChat, "selectedChat");
  }, [selectedChat]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn setUserData={setUserData} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <Home
              currentUser={userData}
              setSelectedChat={setSelectedChat}
              selectedChat={selectedChat}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
