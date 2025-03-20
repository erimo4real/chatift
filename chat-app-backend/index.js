require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const app = express();
console.log("MONGO_URI:", process.env.MONGO_URI);
// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Adjust for frontend
app.use(cookieParser());

// Connect to Database
connectDB();

// Serve static files
app.use("/uploads", express.static("uploads"));


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Chat App API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
