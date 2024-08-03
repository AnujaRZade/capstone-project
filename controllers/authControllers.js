const User=require("../models/userModels"
    
)
app.post("/signup", async function (req, res) {
    try {
        const userObj = req.body;
        const user = await User.create(userObj)
        res.json({
            message: "user created", user
        })
    } catch (err) {
        console.log(err.message);
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
        const data = jwt.sign({data:payload}, SECRET_KEY, { expiresIn: '1h' });

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