//making a router
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

//just like express


const router = Router()

router.route("/register").post(registerUser)


export default router