import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try{
        //storing the response in a variable, mongoose allows that
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
         console.log(`\n MongoDB connected !! DB HOST:
             ${connectionInstance.connection.host}`);
             //connection.host gives the mongodb url
    }
    catch(error){
        console.log("MONGODB connection error", error);
        //node js allows process, process.exit() is a method
        process.exit(1)
    }

}
export default connectDB