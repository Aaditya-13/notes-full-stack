import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

app.use("/api", globalLimiter)

// import routes
import userRouter from "./routes/user.routes.js"

import noteRouter from "./routes/note.routes.js"

import tagRouter from "./routes/tag.routes.js";

// routes declaration 
app.use("/api/v1/users", userRouter)

app.use("/api/v1/notes", noteRouter)

app.use("/api/v1/tags", tagRouter);


export {app}