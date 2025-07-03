import Student from "../models/student.js";

export function getstudents(req,res)
{
 
 Student.find()
 .then((students)=>{
    res.json(students);
}).catch(()=>{
    res.json({
        message:"Failed to fetch students"
    })
})


}


export function createstudents(req,res)
{

    const student=new Student({
        name:req.body.name,
        age:req.body.age,
        email:req.body.email
    })  
    student.save().then(()=>{
        res.json({
            message:"Student saved"
        })
    }).catch((err)=>{

        res.json({
            message:"Failed to save student"
        })
    })
   

}










