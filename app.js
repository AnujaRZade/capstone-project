const express = require('express') //common js module\
const short = require("short-uuid");
const mongoose = require("mongoose");
const User = require("./models/userModels")
const Product = require("./models/productModels")

const { checkInput } = require("./utils/crudFactory")

const {
    createUserHandler,
    getUserById,
  
    getUserHandler,
    updateUserById, } = require("./controllers/userControllers");

const { createrProductHanlder,
    getProductById,
    updateProductById,
    getProductHandler, } = require("./controllers/productControllers")

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

app.get('/api/user', getUserHandler)
app.post('/api/user', checkInput, createUserHandler) //chaining
app.get("/api/user/:id", getUserById)
app.patch("/api/user/:id", updateUserById)


/***Product routes ***************/
app.get('/api/product', getProductHandler)
app.post('/api/product', checkInput, createrProductHanlder) //chaining
app.get("/api/product/:id", getProductById)
app.patch("/api/product/:id", updateProductById)

//Catch-all route, default fallback kind of middleware for all remaining routes
app.use(function (req, res) {
    res.status(404).send('404 Not Found')
})

//get server up and listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


