import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./route/user.js";
import profileRoutes from "./route/profile.js";
import preferenceRoutes from "./route/preference.js";
import discovereRoutes from "./route/discover.js";
import likeRoutes from "./route/like.js";
import matchRoutes from "./route/match.js";
import messageRoutes from "./route/message.js";

const app = express();
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://avena-appcom.vercel.app",
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);


// DATABASE
mongoose
  .connect(process.env.MOGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) =>
    console.error("MongoDB error:", err)
  );


// TEST ROUTE
app.get("/", (req, res) => {

  res.send("hello Japhet you are cute");

});



// ROUTES
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/preference", preferenceRoutes);
app.use("/api/discover", discovereRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/message", messageRoutes);

// CREATE HTTP SERVER
const server = createServer(app);

// SOCKET.IO
const io = new Server(server, {

  cors: {
    origin: [
      "http://localhost:5173",
      "https://avena-appcom.vercel.app",
    ],
    credentials: true,
  },

});

// ONLINE USERS
const onlineUsers = {};
const lastSeenUsers = {};

// SOCKET CONNECTION
io.on("connection", (socket) => {
   console.log("socket:", socket.id)

  

  // USER JOINS
  socket.on("join", (userId) => {

  onlineUsers[userId] = socket.id;
   

  io.emit(
    "getOnlineUsers",
    Object.keys(onlineUsers)
  );

  
});

  // USER DISCONNECTS
  socket.on("disconnect", () => {

  // console.log("User disconnected");

  const disconnectedUser = Object.keys(
    onlineUsers
  ).find(
    (userId) =>
      onlineUsers[userId] === socket.id
  );

  // console.log(
  //   "FOUND USER:",
  //   disconnectedUser
  // );

  if (disconnectedUser) {

    lastSeenUsers[disconnectedUser] =
      new Date();

    delete onlineUsers[disconnectedUser];

    io.emit(
      "getOnlineUsers",
      Object.keys(onlineUsers)
    );

    // console.log("EMITTING LAST SEEN");

    io.emit("userLastSeen", {
      userId: disconnectedUser,
      lastSeen:
        lastSeenUsers[disconnectedUser],
    });

  }

});
});

// START SERVER
const PORT = process.env.PORT;

server.listen(PORT, () => {

  console.log(
    `✅ Backend running on http://localhost:${PORT}`
  );

});