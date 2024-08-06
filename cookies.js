const express = require("express")
//parse cookie header and populate that data in req.cookie object
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");//for signin

const SECRET_KEY = "someRandomKey@12321" // for signin
const User = require("./models/userModels"); // for signup

const mongoose = require("mongoose") //for signup
const app = express()
app.use(express.json());

require('dotenv').config() //help read configuration in .env fie and make available in process.env
console.log(process.env.port)
const PORT = process.env.PORT;

/**Database Connection  for signup ***********************/
mongoose.connect(process.env.DB_URL).then((connection) => {
    console.log("DB connected");
}).catch((err) => {
    console.log("DB connection failed");
})


app.use(cookieParser());

app.get("/test", (req, res) => {
    res.json({ message: "Test route is working" });
});

app.get("/", (req, res) => {
    //set cookies to =>"name","value", {maxAge:miliseconds*secs*min*hr*days, security- only accessed through http}
    res.cookie("pageVisited", "home",
        { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    res.json({ message: "welcome to the homepage" })
})

app.get("/checkCookie", (req, res) => {
    console.log(req.cookies);
    const { pageVisited } = req.cookies // if cookies TTL is not expired then pagevisited with contain cookie info
    if (pageVisited) { //if recently set cookie has not expired then do this
        res.json({
            message: "welcome to the products page"
        })
    }
    else {
        res.json({//if cookies are not set or expired do this
            message: "you are visiting for the first time"
        })
    }
})

app.get("/setCookieToThisPathOnly", (req, res) => {
    res.cookie("product", "bestSeller", {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        path: "/setCookieToThisPathOnly",
    })
    //Or const { product } = req.cookies ;// if cookies TTL is not expired then pagevisited with contain cookie info
    const product = req.cookies.product

    if (product) { //if recently set cookie has not expired then do this
        res.json({
            message: "welcome to the products page",
            data: product
        })
    }
    else {
        res.json({//if cookies are not set or expired do this
            message: "you are visiting for the first time"
        })
    }
})

app.get("/clearCookies", (req, res) => {
    res.clearCookie("pageVisited", { path: '/' });
    res.json({
        message: "cookies cleared"
    })
})

app.get("/signin", (req, res) => {
    const payload = 1234; // secret data to passed to token

    try {
        jwt.sign({ data: payload }, SECRET_KEY, { expiresIn: "1h" }, function (err, data) {
            if (err) {
                throw new Error(err.message)
            }
            res.cookie("token", data,
                { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
            res.json({ message: data });
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Validate the password (in a real app, hash and compare the password)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT payload with user-specific information
        const payload = {
            id: user._id,
            email: user.email
        };

        // Sign the JWT with the payload
        const data = jwt.sign({ data: payload }, SECRET_KEY, { expiresIn: '1h' });

        // Set the JWT as a cookie
        res.cookie('token', data, {
            maxAge: 1000 * 60 * 60, // 1 hour
            httpOnly: true // Prevents client-side access to the cookie
        });

        // Send response with user information and token
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email
            },
            token: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// decrpting what was sent encrypted by signin  api 
app.get("/verify", (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        } else {
            const decoded = jwt.verify(token, SECRET_KEY);
            const userId = decoded._id; // Extract user ID from the decoded token

            res.json({
                message: 'Token verified successfully',
                userId: userId, // Send back user ID
            });
        }
    } catch (err) {
        console.log(err);
    }
})

app.post("/signup", async function (req, res) {
    try {
        const userObj = req.body;

        // Input validation can be added here
        // For example, checking if required fields are present
        const user = await User.create(userObj);

        // Send success response with status code 201 for resource creation
        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (err) {
        console.error(err.message);

        // Send error response with appropriate status code
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})




const protectRoute = async function (req, res, next) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, SECRET_KEY);

        console.log("decoded.data", decoded.data, "decoded", decoded)

        const user = await User.findById(decoded.data);
        if (!user) {
            res.status(400); json({
                message: "user not found"
            })
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: "invalid token",
        })
    }
}

app.get("/userData", protectRoute, async function (req, res) {
    res.status(200).json({
        message: "user data fetched",
        data: req.user
    })
})

app.get("/logout", function (req, res) {
    res.clearCookie("pageVisited", { path: '/' });
    res.json({
        message: "u r logged out "
    })
})

app.listen(3000, () => {
    console.log("server started");
})