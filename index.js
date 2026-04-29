import dotenv from "dotenv"
dotenv.config()
import mongoose from"mongoose";
import express from "express";
import cors from "cors";
import path from "path"
import userRoutes from './route/user.js'
import profileRoutes from './route/profile.js'
import preferenceRoutes from './route/preference.js'
import discovereRoutes from './route/discover.js'
import likeRoutes from './route/like.js'
import matchRoutes from './route/match.js'
import messageRoutes from './route/message.js'



const app = express();
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  methods:'GET,POST,PUT,DELETE',
  allowedHeaders:'Content-Type,Authorization',
  credentials: true ,
}))


mongoose
  .connect(process.env.MOGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));




app.get ('/' , (req, res) => {
res.send ("hello Japhet you are cute")
})

//Route
app.use('/api/user', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/preference',preferenceRoutes)
app.use('/api/discover',discovereRoutes)
app.use('/api/like',likeRoutes)
app.use('/api/match',matchRoutes)
app.use('/api/message',messageRoutes)


// Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("✅ Backend running on http://localhost:3000");
});