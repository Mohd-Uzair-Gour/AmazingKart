const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required:true,
        unique:true,
    },
    lastName:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    phoneNumber:{
        type: String,
    },
    address:{
        type: String,
    },
    country:{
        type: String,
    },
    state:{
        type: String,
    },
    city:{
        type: String,
    },
    zipCode:{
        type: Number,
    },
    password:{
        type: String,
        required:true,
    },
    isAdmin:{
        type: Boolean,
        required:true,
        default:false,
    },
},{
    timestamps:true,
})

const User= mongoose.model("User",userSchema)
module.exports = User;