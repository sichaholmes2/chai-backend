//making a router
import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserCoverImage, getUserChannelProfile, getWatchHistory, updateUserAvatar } from "../controllers/user.controller.js";
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
//route for change password
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

//for current user
router.route("/current-user").get(verifyJWT, getCurrentUser)

//for updating account details
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

//files
//for avatar
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

// cover image
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

//username
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

//watch history
router.route("/history").get(verifyJWT, getWatchHistory)



export default router