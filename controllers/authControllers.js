const User = require("../models/userModels")
const { emailBuilder } = require("../nodeMailer")
const jwt = require("jsonwebtoken");//for signin

const SECRET_KEY = "someRandomeKey@123";

const protectRoute = async function (req, res, next) {
    try {
        // Retrieve the token from cookies
        const token = req.cookies.token
        // Check if token is missing
        if (!token) {
            return res.status(401).json({
                message: "You don't have permissions. Token is missing.",
            });
        }
        // Verify the token using the secret key
        const decoded = jwt.verify(token, SECRET_KEY);

        console.log("decoded.data", decoded.data, "decoded", decoded);

        if (decoded) {
            const userId = decoded.data.id; // Extract the user ID from the token
            req.userId = userId; // Attach user ID to request object
            next(); // Continue to the next middleware or route handler
        }
    } catch (err) {
        // Handle invalid token or verification failure
        console.log("Error in token verification:", err);
        res.status(401).json({
            message: "You don't have permissions. Invalid token.",
        });
    }
}

const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000)//otp should be six digit,
    //mathrandom will generate unique nos from 0 to 0.9
    //if math.random generates 0- lowest no will 100000 and max no 0.9 mulplied by 900000 will be 899999- so largest no=999999
}
const resetPassword = async (req, res) => {
    //user send the token and the new password
    //verify the token is valid
    //update the user's password
    console.log('Reset password route called');
    try {
        const { token, password, email } = req.body;
        const { userId } = req.params;
        const user = await User.findById(userId);
        console.log(`Received request for userId: ${userId}`);
        if (!user) {
            res.status(400).json({
                status: "fail",
                message: "User not found",
            })
        } else {
            if (user.token !== token) {
                res.status(400).json({
                    status: "fail",
                    message: "invalid token",
                })
            } else {
                if (user.otpExpiry < Date.now()) {
                    res.status(400).json({
                        status: "fail",
                        message: "Token expired",
                    })
                } else {
                    user.password = password
                    user.token = undefined
                    user.otpExpiry = undefined
                    await user.save();
                    res.status(200).json({
                        status: "success",
                        message: "Password is updated"
                    });
                }
            }
        }
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        })
    }
}

const forgetPassword = async (req, res) => {
    // This function handles the password reset process by generating an OTP and sending it to the user's email.
    // Steps:
    // 1. Extract email from request body
    // 2. Verify if the user exists in the database
    // 3. Generate a one-time password (OTP)
    // 4. Save the OTP and its expiration time in the user's document
    // 5. Send the OTP to the user's email

    try {
        // Extract the email from the request body
        const { email } = req.body;

        // Search for the user by email in the database
        const user = await User.findOne({ email });

        // If the user does not exist, respond with an error message
        if (!user) {
            res.status(400).json({
                status: "fail", // Changed 'fail' to a string to prevent a reference error
                message: "User not found" // Fixed capitalization
            });
        } else {
            // Generate a 6-digit OTP using the otpGenerator function
            const token = otpGenerator();

            // Save the OTP and set an expiration time (5 minutes from now)
            user.token = token.toString();
            user.otpExpiry = Date.now() + 1000 * 60 * 5; // Set OTP to expire in 5 minutes

            // Save the updated user object with the token and expiration
            await user.save();

            // Log the generated token to the console for debugging purposes
            console.log("token", token);

            // Use the emailBuilder utility to send an email with the OTP
            emailBuilder(user.email, "Reset Password", `<strong>Your OTP is ${token}</strong>`)
                .then(() => {
                    console.log("Email is sent");
                });

            // Respond with a success message
            res.status(200).json({
                status: "success",
                message: "Token sent to your email",
            });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({
            status: 400,
            message: error.message, // Use the correct error variable
            data: "An error occurred during the password reset process",
        })
    }
}

const isAuthorized = function (allowedRoles) {
    return async function (req, res, next) {
        const userId = req.userId;
        console.log(userId)
        const user = await User.findById(userId)
        if (allowedRoles.includes(user.role)) {
            next()
        } else {
            res.status(401).json({
                message: "you are not authorized to access this "
            })
        }
    }
}
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.userId; // Use req.userId, which should be set by protectRoute middleware

        // Find the user by ID in the database
        const user = await User.findById(userId);

        // Check if the user was found
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        // Check if the user has an admin role
        if (user.role === "admin") {
            next();
        } else {
            res.status(403).json({
                status: "failed",
                message: "You are not authorized to access this route",
            });
        }
    } catch (err) {
        // Handle any unexpected errors
        console.error("Error in isAdmin middleware:", err);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};


async function signupHandler(req, res) {
    try {
        const userObj = req.body;
        const user = await User.create(userObj);
        res.json({
            message: "user created", user
        })
    } catch (err) {
        console.log(err);
    }
}

async function loginHandler(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ email: email });
        console.log(user)

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
        }
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
}

// Logout handler
async function logoutHandler(req, res) {
    try {
        // Clear the JWT token cookie
        res.clearCookie('token', {
            httpOnly: true, // Ensure it's not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'strict', // Helps protect against CSRF attacks
        });

        res.status(200).json({
            status: "success",
            message: "Successfully logged out"
        });
    } catch (err) {
        console.error("Error during logout:", err);
        res.status(500).json({
            status: "fail",
            message: "Internal server error"
        });
    }
}

module.exports = {
    forgetPassword,
    resetPassword,
    protectRoute,
    signupHandler,
    loginHandler,
    isAdmin,
    logoutHandler,
    isAuthorized,
}
/*
protectRoute
Purpose: To ensure that the user is authenticated.
Checks:
Verifies that the request includes a valid authentication token (usually in cookies).
If the token is missing or invalid, it sends a 401 Unauthorized response and halts the request.
Role: Ensures that only authenticated users can access the protected routes.
isAuthorized
Purpose: To ensure that the authenticated user has the required permissions or role to perform a specific action.
Checks:
After protectRoute has confirmed that the user is authenticated, isAuthorized verifies if the user’s role or permissions match the required criteria.
If the user does not have the required role or permission, it sends a 403 Forbidden response.
Role: Ensures that authenticated users have the necessary permissions or roles to access specific routes or perform certain actions.
*/