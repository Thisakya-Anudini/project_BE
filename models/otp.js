import mongoose from "mongoose";
//save in database
const otpSchema = new mongoose.Schema({

    email: { type: String, required: true },
    otp: { type: String, required: true },

});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
