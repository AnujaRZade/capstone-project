const express = require('express');
const authRouter = express.Router();

const { checkInput } = require("../utils/crudFactory")
const {
    forgetPassword,
    resetPassword,
    signupHandler,
    loginHandler,
}= require("../controllers/authControllers")

/*routes for authentication*/

authRouter.post("/forgetPassword", forgetPassword)
authRouter.patch("/resetPassword/:userId", resetPassword)
authRouter.post("/signup", checkInput, signupHandler);
authRouter.post('/login', loginHandler);
authRouter.patch('/resetPassword/:userId', resetPassword)

module.exports=authRouter;