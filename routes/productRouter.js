const express = require('express');
productRouter = express.Router();
const Product= require("../models/productModels")

const { checkInput } = require("../utils/crudFactory")

const{
    createProductHandler,
    getProductById,
    getProductHandler,
    updateProductById,
    deleteProductById,

} = require ("../controllers/productControllers");

/**Orignal path for get products looked like /api/products/  ***/
productRouter.get("/", getProducts)
productRouter.post("/",checkInput, createProductHandler);
productRouter.get("/:id", getProductById)
productRouter.patch("/:id", updateProductById)
productRouter.delete("/:id", deleteProductById)

async function getProducts(req, res) {
    const sortQuery = req.query.sort;
    const selectQuery = req.query.select;
    /* sorting logic */
    let queryResPromise = Product.find();

    if (sortQuery) {
        const [sortParam, order] = sortQuery.split(" ");
        // console.log("sortParams", sortParam); 
        // console.log("order", order);

        if (order === "asc") {
            queryResPromise = queryResPromise.sort(sortParam)

        } else {
            queryResPromise = queryResPromise.sort(`-${sortParam}`)
        }
    }
    if (selectQuery) {
        // Split by comma and join with spaces
        // const fields = selectQuery.split(',').join(' ');
        // console.log("fields are", fields);
        queryResPromise = queryResPromise.select(selectQuery);
    }
    const result = await queryResPromise


    res.status(200).json({
        message: "search successfull",
        data: result
    })
}
module.exports = productRouter;
