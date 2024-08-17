//making a router
import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

//importing upload from multer middleware
import { upload } from "../middlewares/multer.middleware.js";
//just like express


const router = Router()

router.route("/register").post(
    //upload from multer give many optiions..multiple fields
    //fields accept array
    //two obects for avatar and cover image
    //the name sould be same in front end and backend(comm bw backend and frontend engineers)
    upload.fields([
        {
            name: "avatar",
            maxCount:1

        },
        {
            name:"coverImage",
            maxCount:1
        }


    ]),

    registerUser
)

router.route("/login").post(loginUser)

//secured routes
//verifying the jwt and logging out
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router