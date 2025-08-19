import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config({ quiet: true });



export function createUser(req,res){


        //authorization
    if(req.user==null){//if user is not logged in or not sent the  token
        res.status(403).json({
            message:"please login to create"
        })
        return
    }
    if(req.user.role != "admin"){//if user is not admin
        res.status(403).json({
            message:"Only admin can create "
        })
        return//stop the function from executing further code below
    }
    const passwordhash=bcrypt.hashSync(req.body.password,10)

    const userData ={
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        phone:req.body.phone,
        email:req.body.email,
        password:passwordhash
    }
    const user=new User(userData)

    user.save().then((user)=>{
        res.json({
            message:"User saved successfully"})
    }).catch((err)=>{
        
        res.json({
            message:"Failed to save user"})
    })
}


//Login
export function loginUser(req,res){
    const email=req.body.email
    const password=req.body.password

    //Find user (only one)
    User.findOne({email:email}).then((user)=>{
        if (user == null){
            res.status(404).json({message:"User not found"})

        }else{
            const ispasswordcorrect=bcrypt.compareSync(password,user.password)          
            if(ispasswordcorrect){  
                const token=jwt.sign(
                    {
                        email:user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        role : user.role,
                        isBlocked:user.isBlocked,
                        isemailverified:user.isemailverified,
                        image:user.image
                    },
                    process.env.JWT_SECRET,
                    

                    
                    )
                
                res.json({
                    token:token,
                    message:"Login successful"
                    
                })
            }else{
                
                res.status(404)
                res.json({
                    
                    message:"Incorrect password"

                })
        }


        }
    }
)  
}
export function isAdmin(req){

    if (req.user== null){
        return false;
    }
    if (req.user.role != "admin"){
        return false;
    }

    return true
}








