/*Contains all the rout handlers*/

const Product = require("../models/productModels");

async function getProductHandler(req, res) {
    try {
        const productData = await Product.find()
        if (productData.length === 0) {
            throw new Error("no product found")
        } else {
            res.json({
                status: 200,
                message: "Data found",
                data: productData
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
}

async function createrProductHanlder(req, res) {
    console.log(req.body);
    try {
        const productDetails = req.body;
        const product = await Product.create(productDetails);
        res.status(201).json({
            message: "Product created successfully",
            data: product
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}


async function getProductById(req, res) {
    try {
        const { id } = req.params;
        console.log("64", req.params);
        const product = await Product.findById(id);
        console.log("product", product);
        if (product == undefined) {
            throw new Error("Product not found");
        } else {
            return res.status(200).json({
                message: product,
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

async function updateProductById(req, res) {
    try {
        const { id } = req.params;
        const updatedProductData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true })
        if (!updatedProduct) {
            throw new Error("product not found")
        }
        else {
            res.status(200).json({
                status: 200,
                message: "product updated successfully",
                data: updatedProduct
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
   
    createrProductHanlder,
    getProductById,
    updateProductById, 
    getProductHandler,
}