import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true

    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    
    },
    date:{
        type: Date,
        default: Date.now  //server time will be stored it will be converted to local time
    },
    products: [              //should save the  details of the products at the time of order because in the future  those products may change
        {
            productId: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],
    notes: {
        type: String,
        default: "No additional notes"
    }


});

const Order = mongoose.model("Order", orderSchema);
export default Order
