//Dependencies
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import studentRouter from "./routers/studentRouter.js";
import userRouter from "./routers/userrouter.js";
import jwt from "jsonwebtoken"



//App
const app=express();
//Middleware 
app.use(bodyParser.json());

app.use(
    (req,res,next)=>{
        //  if there is a token  
        const value=req.header("Authorization")// token is here 
        if(value!=null){
        const token=value.replace("Bearer ","")// remove bearer

        jwt.verify(token,"secret",(err,decoded)=>{//check token whether it is decoded or not
            if(decoded == null)//if token was not decoded then decoded will be null  and error will be true
                {
                    res.status(403).json({//403 means forbidden
                    message:"Unauthorized"//token is not valid
                }
                )
                }

            else{
            req.user=decoded//token is valid and able to read the userdata nd proceed to            next()

        } 

        })

        } else{ // if there is no token
            next(); //proceed to next level
        }          
       
    }

)
 
// Routers
app.use("/students",studentRouter)
app.use("/users",userRouter)







//Database
const connectionstring="mongodb+srv://anu:anu@cluster0.cp7le2r.mongodb.net/dev?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(connectionstring).then(()=>{
    console.log("Database connected");
}).catch(()=>{
    console.log("failed to connect");   
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




















        