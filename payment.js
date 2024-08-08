const express = require("express")
const Razorpay = require("razorpay")
const shortid = require("shortid")
require("dotenv").config();
const cors = require('cors')
const crypto = require("crypto");

const app = express()
app.use(express.json())
app.use(cors());

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.post("/checkout", (req, res) => {
    var options = {
        amount: 100000,  // amount in the smallest currency unit 1 rupees= 100 paise, unit here is paise for INR
        currency: "INR",
        receipt: shortid.generate()
    };
    instance.orders.create(options, function (err, order) {
        if (err) {
            console.error("Order creation failed:", err);
            return res.status(500).json({ error: "Order creation failed" });
        }
        console.log("Order created:", order);
        res.status(201).json(order); // Send order data to client
    });
})

// app.post('/verify', (req, res) => { ///this will be called from razorpay webhook
//     try {
//         console.log("webhook called", req.body);
//         //CREATION OF SIGNATURE
//         const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET); // add secret
//         shasum.update(JSON.stringify(req.body)) //req.body contains payload which razorpay sending to us
//         const freshSignature = shasum.digest("hex")// generate the hash(hexadecimal string) ie signature which razorpay has generated
//         console.log("comparing signatures", freshSignature, req.headers["x-razorpay-signature"]);
//         if (freshSignature === req.headers["x-razorpay-signature"]) {
//             console.log("rquest is legit");
//             res.json({
//                 status: "ok",
//             })
//         } else {
//             return res.status(400).json({
//                 status: "error",
//                 message: "invalid signatur"
//             })
//         }
//     } catch (err) {
//         console.log(err);
//     }
// })
app.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
});