//async handlerjs is a user a wrapper for promises so importing that
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//creating a method for registering user
const registerUser = asyncHandler( async (req, res) => {
  //registering the user
  //get yser details from frontend(u dont need react. u can get them through postman )
  //validation of user email(e.g if its not empty using username or email)
  //check for coverimage and avatar
  //if there upload them to cloudinary, especially for avatr
  //create a user object-create entry in db
  //remove password and refresh token from response
  //check for user creation(if u r getting null response or if user is created)
  //return response


  //getting details from frontend using req,body
  //destructuring body
  const {fullName, email, username, password}= req.body
  console.log("email:", email)


 //we can only  handle data in json and not files
 //for that we need multer middlwares in routes
 

 //checking if fields are empty
//  if(fullName===""){
//     //throw error
//     throw new ApiError(400, "fullname is req")
//  }
 //the above is beginner approach
 //this is better one
  if(
    [fullName, email, username, password].some((field)=>
        field?.trim()==="")
    //if any of the abv field is empty it will return true

  ){
    throw new ApiError(400, "All fields are required")

  }

  //imported user from user.models.js
  //finding the user from the database that matches the email/username
 const existedUser= User.findOne({
    //ehatever it gets first out of the two its user
    $or:[{username}, {email}]
  })

  //if existedUser is there we dont need to proceed
  if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
  }


//handling images..avatar
//fisrt property and getting the file from multer
//in multer.middleware.js, the file is already saved in multer with ist original name
   const avatarLocalPath= req.files?.avatar[0]?.path

//doing the same for cover image
const coverImageLocalPath=req.files?.coverImage[0]?.path


if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")

}

//uploading avatar and localImage to cloudinary
//method already made in cloudinary.js so just import it
//but it takes time so await async
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)


if(!avatar){
    throw new ApiError(400,"Avatar file is required")

}

//making an object and inserting to db
const user= await User.create({
    fullName,
    avatar:avatar.url,
    //if coverimage exsists use its url else keep it empty as it is not mandatory
    coverImage: coverImage?.url || "",
    email,
    password,

    // i want username to be in lowercase
    username:username.toLowerCase()

})

//checking if user was created
   const createdUser= await User.findById(user._id).select(
    //selecting the field we dont need
    "-password -refreshToken"
   )
 if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
 }



//now we will make response using apireponse.js and import it
return res.status(201).json(
    //making the object
    new ApiResponse(200, createdUser, "user registered successfully")
)







})
// this method will be run when sime url is hit
//for that url all are there in the routes folder

export {
    registerUser,

}