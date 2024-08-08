const express = require("express")
const reviewRouter = express.Router()
const Review = require("../models/reviewModels")
const { protectRoute } = require("../controllers/authControllers")
const Product = require("../models/productModels")

reviewRouter.post("/:productId", protectRoute, async (req, res) => {
    /* 1. get the product id from the params
        2.get the review and rating from the body
        3. get the userid from the req object-protectRoute
        4. update/ add the rating and review to the product
        5. create a review object
        6. push the review id in the product reviewds array
        */
    try {
        const userId = req.userId
        const productId = req.params.productId
        const { review, rating } = req.body

        const reviewObj = await Review.create({
            review, rating, user: userId, product: productId
        })
        const productObj = await Product.findById(productId);
        const avgRatings = productObj.avgRatings;
        if (avgRatings) {
            const sum = avgRatings * productObj.reviews.length;
            const finalAvgRatings = (sum + rating) / (productObj.reviews.length + 1)
            productObj.avgRatings = finalAvgRatings;
        } else {
            productObj.avgRatings = rating;
        }

        productObj.reviews.push(reviewObj._id);
        await productObj.save();
        res.status(200).json({
            message: "review added succesfully",
            data: reviewObj
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            data: " reviewrouter error"
        })
    }

})


module.exports = reviewRouter;
