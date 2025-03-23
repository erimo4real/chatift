require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Adjust for frontend
app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Chat App API is running...");
});

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {}; // Store online users

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a chat room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle public messages
  socket.on("sendMessage", (data) => {
    io.to(data.chatRoom).emit("receiveMessage", data);
  });

  // Handle private messages
  socket.on("sendPrivateMessage", ({ sender, receiver, content }) => {
    io.to(receiver).emit("receivePrivateMessage", { sender, content });
  });

   // Handle user online status
   socket.on("userOnline", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(onlineUsers)); // Broadcast to all users
  });

  // Handle user typing status
  socket.on("typing", ({ chatRoom, user }) => {
    socket.to(chatRoom).emit("userTyping", user);
  });

  socket.on("stopTyping", ({ chatRoom, user }) => {
    socket.to(chatRoom).emit("userStoppedTyping", user);
  });

   // Handle message read status
   socket.on("markAsRead", ({ senderId, receiverId }) => {
    io.to(senderId).emit("messageRead", { senderId, receiverId });
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
  if (userId) {
    delete onlineUsers[userId];
    io.emit("onlineUsers", Object.keys(onlineUsers)); // Notify all users
  }
    console.log("User disconnected:", socket.id);
  });
});


// Start server (Only one `listen` function)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
