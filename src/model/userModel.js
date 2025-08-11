import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:[true, "Please provide a username"],
        unique:true
    },
    
    email:{
        type:String,
        require:[true, "Please provide a email"],
        unique:true
    },
    
    password:{
        type:String,
        require: false
    },
    
    isVerified:{
        type:Boolean,
        default:false
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,

    // credits of user

    credits: {
        type:Number,
        default: 2
    },
    lastCreditReset:{
        type:Date,
        default: Date.now
    }
},{
    timestamps:true
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User