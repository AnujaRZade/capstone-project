/*Contains all the rout handlers*/

const User = require("../models/userModels");

const { emailBuilder } = require("../nodeMailer");

const { createFactory, getElementByIdFactory, getAllFactory, deleteElementByIdFactory, updateElementFactory, } = require("../utils/crudFactory")

const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000)//otp should be six digit,
    //mathrandom will generate unique nos from 0 to 0.9
    //if math.random generates 0- lowest no will 100000 and max no 0.9 mulplied by 900000 will be 899999- so largest no=999999
}
const forgetPassword = async (req, res) => {
    //user sends their email
    //email exists in the database
    //generate a random token
    //send the token to the user's email
   
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
      
        if (!user) {
            res.status(400).json({
                status: fail,
                message: "user not found"
            })
        } else {
            const token = otpGenerator();
            user.token = token.toString();
            user.otpExpiry = Date.now() + 1000 * 60 * 5;
            await user.save();
            console.log("token", token);
            emailBuilder(user.email, "Reset Password", `<strong>Your otp is${token}</strong>`)
                .then(() => {
                    console.log("email is sent")
                })
            res.status(200).json({
                status: "success",
                message: "Token sen to your mail",
            })
        }
    } catch (error) {
        res.status(400).json({
            status:400,
            message:err.message,
            data:"here",
        })
    }

}

const resetPassword = async (req, res) => {
    //user send the token and the new password
    //verify the token is valid
    //update the user's password
    console.log('Reset password route called');
    try {
        const { token, password, email } = req.body;
        const { userId } = req.params;
        const user = await User.findById(userId);
        console.log(`Received request for userId: ${userId}`);
        if (!user) {
            res.status(400).json({
                status: "fail",
                message: "User not found",
            })
        } else {
            if (user.token !== token) {
                res.status(400).json({
                    status: "fail",
                    message: "invalid token",
                })
            } else {
                if (user.otpExpiry < Date.now()) {
                    res.status(400).json({
                        status: "fail",
                        message: "Token expired",
                    })
                } else {
                    user.password = password
                        user.token = undefined
                        user.otpExpiry = undefined
                        await user.save();
                    res.status(200).json({
                        status: "success",
                        message: "Password is updated"
                    });
                }
            }

        } 
    }catch (err) {
            res.status(400).json({
                status: "fail",
                message: err.message,
            })
        }


    }

const createUserHandler = createFactory(User);
    const getUserHandler = getAllFactory(User)
    const getUserById = getElementByIdFactory(User);
    const updateUserById = updateElementFactory(User);
    const deleteUserById = deleteElementByIdFactory(User);



    module.exports = {
        createUserHandler,
        getUserById,
        getUserHandler,
        updateUserById,
        deleteUserById,
        forgetPassword,
        resetPassword,

    }