const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/conversations", require("./src/routes/conversationRoutes"));
app.use("/api/messages", require("./src/routes/messageRoutes"));

// Root route
app.get("/", (req, res) => res.send("Socket.io Chat API Running"));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 🔌 Setup socket.io next
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
