import mogoose from "mongoose";
//Schema
const userSchema = new mogoose.Schema({
    firstName: {
        type: String,
        required: true  //compulsory
    },
    lastName: {
        type: String,
        required: true
        },
    phone: {
        type: String,
        default :"Not given"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

     password: {
        type: String,
        required: true  
    }, 


 
    isBlocked: {
        type: Boolean,
        default: false //not blocked
    },
    role: {
        type: String,
        default: "user"
    },
    isEmailVerified:{
        type: Boolean,
        default: false//not verified
    },
    image :     {
        type: String,
        default: "https://i.pinimg.com/736x/21/20/b0/2120b058cb9946e36306778243eadae5.jpg"
    }






})


export default mogoose.model("users",userSchema)
