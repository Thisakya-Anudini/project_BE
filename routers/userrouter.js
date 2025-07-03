import express from "express";
import {createUser, loginUser} from "../controllers/usercontroller.js"


//Router
const userRouter=express.Router();



//Post

userRouter.post("/",createUser); 
userRouter.post("/login",loginUser)

export default userRouter