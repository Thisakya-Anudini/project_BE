//Dependencies
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./routers/productRouter.js";



//App
const app=express();
//Middleware 
app.use(bodyParser.json());

app.use((req, res, next) => {
    const value = req.header("Authorization");  // Get the token from the header
    if (value != null) {
        const token = value.replace("Bearer ", "");  // Remove the "Bearer" part
        console.log("Token received:", token);  // Log the token to check if it’s being passed correctly

        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err);  // Log token verification error
                return res.status(403).json({ message: "Unauthorized" });
            }
            req.user = decoded;  // Attach the decoded user data to the request object
            console.log("Decoded user:", decoded);  // Log the decoded user data
            next();  // Proceed to the next middleware or route handler
        });
    } else {
        next();  // If no token is provided, proceed without authentication
    }
});
 
// Routers

app.use("/api/users",userRouter)
app.use("/api/products", productRouter);






//Database
const connectionstring="mongodb+srv://anu:anu@cluster0.cp7le2r.mongodb.net/dev?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(connectionstring).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.error("Database connection error:", error);  // Log connection issues
});




app.delete("/",(req,res)=>{
    console.log(req.body);
    res.json({
        message:"This is a delete request"
    })
}
)  

               
app.put("/",(req,res)=>{
    console.log(req.body);
    res.json({
        message:"This is a put request"
    })  
 
}
)  

//Server
app.listen(5000,()=>{
    console.log("server started");
    console.log("http://localhost:5000");
    }) 




















        