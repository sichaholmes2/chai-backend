//async handlerjs is a user a wrapper for promises so importing that
import { asyncHandler } from "../utils/asyncHandler.js";

//creating a method for registering user
const registerUser = asyncHandler( async (req, res) => {
    //sending a json response

    res.status(500).json({
        message: "chai aur code"
    })

})
// this method will be run when sime url is hit
//for that url all are there in the routes folder

export {
    registerUser,

}