import dotenv from "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js";

connectDB()

const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONT_END_DOMAIN,
  credentials: true
}))

// routes
app.get("/", (req, res) => {
  res.send("API is running!");
});
app.use("/api/auth", authRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  port ? console.log(`Server is running on port ${port}`) : console.log("PORT is not defined in environment variables.");
});