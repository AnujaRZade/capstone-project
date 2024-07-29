const express = require('express');
userRouter = express.Router();
const{
    createUserHandler,
    getUserById,
    getUserHandler,
    updateUserById,
    deleteUserById,

} = require ("../controllers/userControllers");

userRouter.get("/", getUserHandler)
userRouter.post("/",checkInput, createUserHandler);
userRouter.get("/:id", getUserById)
userRouter.patch("/:id", updateUserById)
userRouter.delete("/:id", deleteUserById)

module.exports = userRouter;
