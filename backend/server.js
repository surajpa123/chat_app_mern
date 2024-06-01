const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   console.log(socket?.id)

// });

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
