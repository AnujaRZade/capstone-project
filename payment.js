const express = require("express")
const Razorpay = require("razorpay")
const shortid=require("shortid")
require("dotenv").config();
const cors= require('cors')

const app = express()
app.use(express.json())
app.use(cors());


var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.post("/checkout",(req,res)=>{
    var options = {
        amount: 100000,  // amount in the smallest currency unit 1 rupees= 100 paise, unit here is paise for INR
        currency: "INR",
        receipt: shortid.generate()
      };   
      instance.orders.create(options, function(err, order) {
        if (err) {
          console.error("Order creation failed:", err);
          return res.status(500).json({ error: "Order creation failed" });
        }
        console.log("Order created:", order);
        res.status(201).json(order); // Send order data to client
      });
})

app.post('/verify',(req,res)=>{ ///this will be called from razorpay webhook
    try{
        console.log("webhook called", req.body);
    }catch(err){
        console.log(err);
    }
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});