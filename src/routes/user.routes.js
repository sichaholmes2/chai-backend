//making a router
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


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


export default router