import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();//load variables from .env file
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import jwt from "jsonwebtoken"
import cors from "cors"

const app = express();

app.use(bodyParser.json()); //app.use for add middleware
app.use(cors())


app.use(
    (req,res,next)=>{
        const value =req.header("authorization");//get token
        if (value!=null){
            const token=value.replace("Bearer ","");//remove bearer from token  
            
            jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
                if(decoded==null){res.status(403).json({message:"unauthorized"})}
                
                else{
                    req.user=decoded;//add user object in request
                    next();
                }
            })
        }
        else{
            next();//pass request to default router
        }
        
        
    }
    
)//middleware,for check token,add user object in request,for authentication

const connectionString = process.env.MONGO_URI
mongoose.connect(connectionString).then(
    ()=>{
        console.log("database connected"

        )
    }
).catch(
    ()=>{
        console.log("failed to connect database");
    }
)

    


app.use("/api/users",userRouter);//api endpoint
app.use("/api/products",productRouter);

app.listen(5000,()=>{
    console.log("server started");
})