const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    confirmedPassword: {  
        type: String,
        //required: true,
        minLength: 8,
        validate: {
            validator: function () {
                return this.password === this.confirmedPassword
            },
            message: "Password and confirmed password should be same"
        }
    },
    id: String,
    
    token: String, //for forgot password
    otpExpiry: Date, //expiry for token
    role: {
        type: String,
        default: 'user',
    },
    bookings:{
        type:mongoose.Types.ObjectId,
        ref:"Booking"
    }
})

const validRoles=["admin","user","seller"]
userSchema.pre("save", function(){
    this.confirmedPassword=undefined;
    if(this.role){
        const Valid=validRoles.includes(this.role);
        if(!Valid){
            next(new Error("user can either be admin, user or seller"))
        }else{
            next()
        }
    }else{
        this.role="user"
        next()
    }
})

userSchema.pre("save", function () {
    this.confirmedPassword = undefined;
})
/** create a model */
const User = mongoose.model("User", userSchema);
module.exports = User;