//async handlerjs is a user a wrapper for promises so importing that
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";



const generateAccessAndRefreshTokens= async(userId)=>{
  try{
   // generating the access/refresh token
   const user= await User.findById(userId)
   const accessToken=user.generateAccessToken()
   const refreshToken=user.generateRefreshToken()

   //putting the refreshtoekn value in user.refreshToken
   user.refreshToken= refreshToken
   //saving it and validating before it
   await user.save({validateBeforeSave: false})

   return {accessToken, refreshToken}

  }catch(error){
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}

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
  //console.log("email:", email)


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
 const existedUser= await User.findOne({
    //ehatever it gets first out of the two its user
    $or:[{username}, {email}]
  })

  //if existedUser is there we dont need to proceed
  if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
  }
  console.log(req.files)


//handling images..avatar
//fisrt property and getting the file from multer
//in multer.middleware.js, the file is already saved in multer with ist original name
   const avatarLocalPath= req.files?.avatar[0]?.path

//doing the same for cover image
//const coverImageLocalPath=req.files?.coverImage[0]?.path



//checking if we are getting tthe array in response and if  the length of the array is >0
let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}




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






const loginUser=asyncHandler(async(req, res)=>{
  //get data from req body
  //givng access acc to username or email or both
  //find user
  //password check if loged in
  //if correct generate access/refresh token
  //send cookies

  //gettting data
  const {email, username, password}=req.body

  //checking with username or email
  if (!username && !email){
    throw new ApiError(400,"Userame or password is required")
  }

  //findone finds the first entry in mongo db..in this case its username or password
  const user= await User.findOne({
    $or:[{username}, {email}]
  })

  if(!user){
    throw new ApiError(404,"User doesnot exist")

  }

  //checking password in boolean
  const isPasswordCorrect = await user.isPasswordCorrect(password)

  if(!isPasswordCorrect){
    throw new ApiError(401,"invalid user credentials")

  }

//making access and refresh token...will be used many time so we make a method
  const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)

  //sending cookies
  const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

  //to make sure that only server can modify the cookies
  const options={
    httpOnly: true,
    secure:true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser, accessToken,
        refreshToken

      },
      "User logged in successfully"
    )


  )





})


//creating logout
const logoutUser = asyncHandler(async(req, res)=>{
//we need to clear cookies which can be olny manged by server
//the refresh token in use.model,js also has to be deleted
//cannot use User.findById as i dont have access to user
//earlier we used email, user to find theuser but it wont work here as people can give any email
//so we use middleware made by us to access user
await User.findByIdAndUpdate(
  //finding user
  req.user._id,
  {
    $set:{
      refreshToken:undefined
    }

  },
  {
     new:true
  }

 )
 const options={
  httpOnly: true,
  secure:true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200, {} ,"User logged Out"))

})


const refreshAccessToken=asyncHandler(async(req,res)=>{
  //refresh token can be accessed from cookies
 const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

 //the api error is the api response
 if(!incomingRefreshToken){
  throw new ApiError(401,"unauthorized request")

 }

 try {
  //verifying the incoming token
  const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
  )
 
  //getting user information thriugh decoded token
  const user= await User.findById(decodedToken?._id)
 
  if(!user){
   throw new ApiError(401,"invalid refreshtoken")
 
  }
 
  //checking if they match
  if(incomingRefreshToken!== user?.refreshToken){
   throw new ApiError(401,"Refresh token is expired or used")
  }
 
  //they have matched, generate new token by sending cookies
  const options={
    httpOnly:true,
    secure:true
  }
  const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
 
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
  new  ApiResponse(
   200,
   {accessToken, refreshToken:newRefreshToken},
   "Access token refreshed"
 
  )
 )
 } catch (error) {
  throw new ApiError(401, error?.message|| "Invalid refresh token")
  
 }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}