const express = require('express');
userRouter = express.Router();

const { checkInput } = require("../utils/crudFactory")

const{
    createUserHandler,
    getUserById,
    getUserHandler,
    updateUserById,
    deleteUserById,
    forgetPassword,
    resetPassword
} = require ("../controllers/userControllers");

/**Orignal path for get users looked like /api/users/  ***/
userRouter.get("/", getUserHandler)
userRouter.post("/",checkInput, createUserHandler);
userRouter.get("/:id", getUserById)
userRouter.patch("/:id", updateUserById)
userRouter.delete("/:id", deleteUserById)

userRouter.post("/forgetPassword", forgetPassword)
userRouter.patch("/resetPassword/:userId", resetPassword)


module.exports = userRouter;
