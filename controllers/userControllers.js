/*Contains all the rout handlers*/

const User = require("../models/userModels");
const Product = require("../models/productModels");
const {  createFactory, getElementByIdFactory, getAllFactory, deleteElementByIdFactory, updateElementFactory, } = require("../utils/crudFactory")


const createUserHandler = createFactory(User);
const getUserHandler = getAllFactory(User)
const getUserById = getElementByIdFactory(User);
const updateUserById = updateElementFactory(User);
const deleteUserById = deleteElementByIdFactory(User);

const createProductHandler = createFactory(Product);
const getProductHandler = getAllFactory(Product)
const getProductById = getElementByIdFactory(Product);
const updateProductById = updateElementFactory(Product);
const deleteProductById = deleteElementByIdFactory(Product);

module.exports = {

    createUserHandler,
    getUserById,
    getUserHandler,
    updateUserById,
    deleteUserById,

    createProductHandler,
    getProductById,
    getProductHandler,
    updateProductById,
    deleteProductById,
}