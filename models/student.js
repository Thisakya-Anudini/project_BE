import mongoose from "mongoose";
//Schema
const Studentschema=new mongoose.Schema({
    
    name:String,
    age:Number,
    email:String
})


//Model -collection & code  connector
const Student=mongoose.model("students",Studentschema)

export default Student;
