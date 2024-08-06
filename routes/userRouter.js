const express = require('express');
userRouter = express.Router();

const { checkInput } = require("../utils/crudFactory")

const {
    createUserHandler,
    getUserById,
    getUserHandler,
    updateUserById,
    deleteUserById,

} = require("../controllers/userControllers");
const { protectRoute, isAdmin, logoutHandler } = require('../controllers/authControllers');

userRouter.use(protectRoute);

/**Orignal path for get users looked like /api/users/  ***/
userRouter.get("/", isAdmin, getUserHandler)
userRouter.post("/", checkInput, createUserHandler);
userRouter.get("/logout", logoutHandler);
userRouter.get("/:id", getUserById)
userRouter.patch("/:id", updateUserById)
userRouter.delete("/:id", deleteUserById)


module.exports = userRouter;
