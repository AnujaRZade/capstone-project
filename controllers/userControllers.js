/*Contains all the rout handlers*/

const User = require("../models/userModels");

const { createFactory, getElementByIdFactory, getAllFactory, deleteElementByIdFactory, updateElementFactory, } = require("../utils/crudFactory")


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

}