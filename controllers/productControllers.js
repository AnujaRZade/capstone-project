/*Contains all the rout handlers*/

const Product = require("../models/productModels");
const {  createFactory, getElementByIdFactory, getAllFactory, deleteElementByIdFactory, updateElementFactory, } = require("../utils/crudFactory")

const createProductHandler = createFactory(Product);
const getProductHandler = getAllFactory(Product)
const getProductById = getElementByIdFactory(Product);
const updateProductById = updateElementFactory(Product);
const deleteProductById = deleteElementByIdFactory(Product);


module.exports = {
    createProductHandler,
    getProductById,
    getProductHandler,
    updateProductById,
    deleteProductById,
}