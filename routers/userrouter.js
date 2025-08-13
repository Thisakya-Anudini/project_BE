import express from "express";
import {createUser, loginUser} from "../controllers/userController.js"


//Router
const userRouter=express.Router();



//Post

userRouter.post("/",createUser); 
userRouter.post("/login",loginUser)

export default userRouter;