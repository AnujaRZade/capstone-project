const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        unique: [true, "Product name should be unique"],
        maxlength: 40,
    },
    price: {
        type: Number,
        required: [true, "required"],
        validate: {
            validator: function () {
                return this.price > 0;
            },
            message: "price should be greater than 0"
        }
    },
    categories: {
        required: true,
        type: [String],
    },
    images: [String],
    avgRatings: {
        type: Number,
        min: 0,
        max: 5
    },
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price
            },
            message: "discount should be less than price"
        }
    },
    description: {
        type: String,
        required: [true, "product description is required"],
        maxLength: [200, "Product description should not exceed 200 chars"]
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        validate: {
            validator: function () {
                return this.stock >= 0;
            },
            message: "Stock should be greater than equal to 0"
        }
    },
    brand: {
        type: String,
        required: true,
    },
    reviews: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Review"
    }


})

/**prehook for validate categories */
const validCategories = ["elec", "clothes", "stationary", "furniture"];

productSchema.pre("save", function (next) {
    const invalidCategories = this.categories.filter((category) => {
        return !validCategories.includes(category)
    })
    if (invalidCategories.length) {
        return next(new Error(`Invalid categories ${invalidCategories.join(" ")}`))
    } else {
        next();
    }
});


/** Post hook */
productSchema.post("save", function () {
    console.log("post hook")
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;