const express = require('express') //common js module
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouters");
const bookingRouter = require("./routes/bookingRouter");
const reviewRouter = require("./routes/reviewRouter");

require('dotenv').config() //help read configuration in .env fie and make available in process.env
console.log(process.env.port)
const PORT = process.env.PORT;

/**Database Connection *************************/
mongoose.connect(process.env.DB_URL).then((connection) => {
    console.log("DB connected");
}).catch((err) => {
    console.log("DB connection failed");
})

const app = express()
app.use(express.json()) // Middleware to parse JSON requests
app.use(cookieParser())

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/auth', authRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/reviews', reviewRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        status: statusCode,
        message: message,
    })
})

//Catch-all route, default fallback kind of middleware for all remaining routes
app.use(function (req, res) {
    res.status(404).send('404 Not Found')
})

//get server up and listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


