//this middleware will vrifiy if the user exists 
// we will verify user on basis on accesstoken/ rfresh toekn 

import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
//we will use.user
export const verifyJWT = asyncHandler(async(req, _, next)=>{
    try {
        const token = req.cookies?.accessToken|| req.header
        ("Authorization")?.replace("Bearer","")
        //if there is no token
        if(!token){
            throw new ApiError(401, "Unauthorized request")
    
        }
        //decoding the token
        const decodedToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    
        //_id comes from generateAccessToken (jwt sign) in user.model.js
        //we dont need password or refreshToken
       const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
    
       if(!user){
        throw new ApiError(401, "Invalid Access Token")
       }
    
       req.user= user;
       next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
        
    }




})