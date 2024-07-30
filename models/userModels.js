const mongoose=require("mongoose")

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
    createdAt: Date
})

userSchema.pre("save",function(){
    this.confirmedPassword=undefined;
})
/** create a model */
const User = mongoose.model("User", userSchema);
module.exports=User;