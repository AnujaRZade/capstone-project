const express = require('express');
productRouter = express.Router();
const Product = require("../models/productModels")

const { checkInput } = require("../utils/crudFactory")

const {
    createProductHandler,
    getProductById,
    getProductHandler,
    updateProductById,
    deleteProductById,

} = require("../controllers/productControllers");

/**Orignal path for get products looked like /api/products/  ***/
productRouter.get("/", getProducts)
productRouter.post("/", checkInput, createProductHandler);
productRouter.get("/bigBillionDay", getBigBillionProducts, getProducts)
productRouter.get("/:id", getProductById)
productRouter.patch("/:id", updateProductById)
productRouter.delete("/:id", deleteProductById)


async function getBigBillionProducts(req, res, next) {
    req.query.filter = JSON.stringify({ stock: { lt: 10 }, avgRatings: { gt: 4 } } );
next();
}

async function getProducts(req, res) {

    let queryResPromise = Product.find();
    /** Pagination logic will be implemented using limit and skip method 
        skip- to skip the document, sort- sort the documents, select-select the fields to be returned ****/
    const limit = req.query.limit;
    const page = req.query.page;
    const skip = (page - 1) * limit;

    if (limit) {
        queryResPromise = queryResPromise.skip(skip).limit(limit)
    }
    /** filter ********************************************************/

    const filterQuery = req.query.filter;
    if (filterQuery) {
        try {
            const filterObj = JSON.parse(filterQuery);//ensures filter query is a valid 

            console.log("filterObj", filterObj);
            // \b- look for the boundary ie entire word, g-globally, replace match with $match
            const filterObjStr = JSON.stringify(filterObj).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
            console.log("filterObjStr", filterObjStr);
            const filterObjFinal = JSON.parse(filterObjStr)
            console.log("filterObjFinal", filterObjFinal);
            queryResPromise = queryResPromise.find(filterObjFinal);
        } catch (error) {
            return res.status(400).json({
                message: "Invalid filter format",
                error: error.message
            });
        }
    }
    /* sorting logic****************************************************** */
    const sortQuery = req.query.sort;
    const selectQuery = req.query.select;
    if (sortQuery) {
        const [sortParam, order] = sortQuery.split(" ");
        queryResPromise = queryResPromise.filter
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
