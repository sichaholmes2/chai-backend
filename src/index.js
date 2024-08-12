//require('dotenv').config()
import dotenv from "dotenv"


import connectDB from "./db/index.js";
import { app } from "./app.js";





dotenv.config({
     path: './.env'
})





//executing the dunction from indexjs of db folder
connectDB()

//connection to db might take time so .then and catch messages
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

/*
import express from "express"


const app= express()

//iffy function for connecting
( async()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/$
            {DB_NAME}`)


            app.on("errror", ()=>{
                console.log("ERRR: ", error)
                throw error

            })

            app.listen(process.env.PORT, ()=>{
                console.log(`App is listening on port ${process.env.PORT}`)
            })


    }catch(error){
        console.error("ERROR: ", error)
        throw err
    }
})()
*/