const express = require('express');
userRouter = express.Router();

const { checkInput } = require("../utils/crudFactory")

const{
    createUserHandler,
    getUserById,
    getUserHandler,
    updateUserById,
    deleteUserById,

} = require ("../controllers/userControllers");

/**Orignal path for get users looked like /api/users/  ***/
userRouter.get("/", getUserHandler)
userRouter.post("/",checkInput, createUserHandler);
userRouter.get("/:id", getUserById)
userRouter.patch("/:id", updateUserById)
userRouter.delete("/:id", deleteUserById)

module.exports = userRouter;
