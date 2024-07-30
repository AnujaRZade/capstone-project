const express = require('express') //common js module\

const mongoose = require("mongoose");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");


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
app.use(express.json()); // Middleware to parse JSON requests

// app.use("/search", async function (req, res) {
//     const sortQuery = req.query.sort;
//     const selectQuery = req.query.select;
//     /* sorting logic */
//     let queryResPromise = Product.find();

//     if (sortQuery) {
//         const [sortParam, order] = sortQuery.split(" ");
//         console.log("sortParams", sortParam); console.log("order", order);

//         if (order === "asc") {
//             queryResPromise = queryResPromise.sort(sortParam)

//         } else {
//             queryResPromise = queryResPromise.sort(`-${sortParam}`)
//         }
//     }

   

//     const result = await queryResPromise


//     res.status(200).json({
//         message: "search successfull",
//         data: result
//     })
// })

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)

/* app.get('/api/user', getUserHandler)
app.post('/api/user', checkInput, createUserHandler) //chaining
app.get("/api/user/:id", getUserById)
app.patch("/api/user/:id", updateUserById)*/
/* app.get('/api/product', getProductHandler)
app.post('/api/product', checkInput, createProductHandler) //chaining
// app.get("/api/product/:id", getProductById)
// app.patch("/api/product/:id", updateProductById)*/

//Catch-all route, default fallback kind of middleware for all remaining routes
app.use(function (req, res) {
    res.status(404).send('404 Not Found')
})

//get server up and listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


