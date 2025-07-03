import express from "express";
import { createstudents, getstudents } from "../controllers/studentcontroller.js";



//Router
const studentRouter=express.Router();  


//get
studentRouter.get("/",getstudents);

//Post
studentRouter.post("/",createstudents);


//export
export default studentRouter
