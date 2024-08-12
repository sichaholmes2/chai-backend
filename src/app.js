import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

//.use is used for middleware configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
//setting a limit on incoming json data

app.use(express.json({limit:"16kb"}))

//url is encoded.. to read that data in backend
app.use(express.urlencoded({extended:true, limit:"16kb"}))

//static is for storing those files that can be accessed by anyone, in this case it is the public folder
app.use(express.static("public"))

//using cookie parser for scure config of cookies
app.use(cookieParser())



//routes import

import userRouter from './routes/user.routes.js'

//routes declaration
//app. get cannot be used as we are using middleware
//whenerver user writes /user control is passed to  userRouter
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

export {app}