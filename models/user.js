import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true // can't be empty
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // no two users can have same email
    },
    password: {
        type: String
    },
    phone: {
        type: String,
        default: "not given" // default value
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user"
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
});

const User = mongoose.model("users", userSchema);
export default User;
