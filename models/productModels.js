const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Product name is required"],
        unique:[true, "Product name should be unique"],
        maxlength:40,       
    },
    price:{
        type:Number,
        required:[true,"required"],
            validate:{
                validator:function(){
                    return this.price>0;
                },
                message:"price should be greater than 0"
            }
        },
    categories:{
        required:true,
        type:String,
    },
    images:[String],
    avgRatings:Number,  
    discount:{
        type:Number,
        validate:{
            validator: function(){
                return this.discount < this.price
            },
            message:"discount should be less than price"
        }
    },  
})

const Product= mongoose.model("Product", productSchema);
module.exports=Product;