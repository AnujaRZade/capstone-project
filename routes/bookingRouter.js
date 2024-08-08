const express = require("express");
const bookingModel = require("../models/bookingModel");
const Razorpay = require("razorpay");
const { protectRoute } = require('../controllers/authControllers');
const User = require("../models/userModels");

const app = express();
app.use(express.json());

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const bookingRouter = express.Router();

bookingRouter.post("/:productId", protectRoute, async (req, res) => {
    try {
        const userId = req.userId
        const productId = req.params.productId;
        const { priceAtBooking } = req.body; // Destructure priceAtBooking from req.body

        if (!priceAtBooking) {
            return res.status(400).json({ error: "Price at booking is required." });
        }

        const bookingObj = {
            user: userId,
            product: productId,
            priceAtBooking: priceAtBooking,
        }
        const booking = await bookingModel.create(bookingObj)//save to booking collections
        //will update user with booking id details
        const user = await User.findById(userId);
        user.bookings.push(booking._id)
        await user.save();

        var options = {
            amount: priceAtBooking * 100, //smallest currency unit-paise
            currency: "INR",
            receipt: booking._id.toString(), //mongodb creates unique id for each row/document its name is  _id
        }


        //updating booking with razor pay payment id
        const order = await instance.orders.create(options)
        console.log("created ordder", order);
        booking.paymentOrderId = order.id; // orderid gets created by razorpay is stored in paymentorder id

        await booking.save();

        res.status(200).json({
            message: order
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Order creation failed" });

    }
})

bookingRouter.get("/getAllBookings", protectRoute, async (req, res) => {
    try {
        const allBookings = await bookingModel.find().populate("user").populate("product")
        //OR
        const allBookings_2 = await bookingModel
            .find()
            .populate({ path: "user", select: "name email" })
            .populate({ path: "product", select: "name, price" })
        //the term user refers to a reference field within the bookingModel schema that links each booking to a specific user in the database.
        if (allBookings) {
            res.status(200).json({
                message: allBookings,
                data: allBookings_2
            })
        }
    } catch (err) {
        res.status(500).json({
            messgae: err.message
        })

    }
})

bookingRouter.post('/verify', async (req, res) => { ///this will be called from razorpay webhook
    try {
        console.log("webhook called", req.body);
        //CREATION OF SIGNATURE
        const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET); // add secret
        shasum.update(JSON.stringify(req.body)) //req.body contains payload which razorpay sending to us
        const freshSignature = shasum.digest("hex")// generate the hash(hexadecimal string) ie signature which razorpay has generated
        console.log("comparing signatures", freshSignature, req.headers["x-razorpay-signature"]);
        if (freshSignature === req.headers["x-razorpay-signature"]) {
            console.log("rquest is legit");
            const booking = await bookingModel.findOne({ paymentOrderId: req.body.payload.payment.entity.order_id });
            //check post verify from ngrok url to get the exact route of order_id
            booking.status = "confirmed"; //  to verify booking is corfimed that whether the order is generated in ngrok webhook
            await booking.save();

            res.json({
                status: "ok",
            })
        } else {
            return res.status(400).json({
                status: "error",
                message: "invalid signatur"
            })
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = bookingRouter;

// In this code, you are creating a booking for a
// product by handling a POST request.
// You first validate and save the booking details in a
//  MongoDB database using Mongoose. Then, you create a
//  Razorpay order for the booking amount, which is processed to initiate a payment transaction,
// and respond with the order details.