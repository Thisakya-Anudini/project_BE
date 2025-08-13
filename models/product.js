import mongoose from "mongoose";
//Schema

const ProductSchema = new mongoose.Schema({
    ProductID:{
        type : String, 
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    alternativenames:{
        type: [String],
        default: []
    },
    labelledprice:{
        type: Number,
        required: true
    }    ,
    Price: {
        type: Number,
        required: true          

    }  ,
    images:{
        type: [String],
        default: [ "/default-product.jpg" ]

    },
    description: {
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    isAvailable:{
        type:Boolean,
        default: true
    }
    
})
//Model -collection & code  connector
const Product = mongoose.model("products",ProductSchema)

export default Product