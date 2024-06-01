const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const chatRoutes = require("./routes/chatRoutes");

const messageRoutes = require("./routes/messageRoutes");

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (currentUser) => {
    socket.join(currentUser?._id);

    socket.emit("connected");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
  });

  socket.on("newMessage", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      console.log(newMessage, "newMessage");
      socket.in(user._id).emit("messageReceived", newMessage);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(currentUser?._id);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server is running on port 5000");
});
