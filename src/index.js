//require('dotenv').config()
import dotenv from "dotenv"


import connectDB from "./db/index.js";





dotenv.config({
    path: './env'
})





//executing the dunction from indexjs of db folder
connectDB()

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