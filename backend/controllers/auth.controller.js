import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

// redirect frontend --> backend-domain.com/api/auth/google --> google oauth page
export const googleLogin = (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&response_type=code&scope=profile email`;
    res.redirect(url);
};

// handle google callback
export const googleCallback = async (req, res) => {
    // google sends ?code=abc123 in query params
    const { code } = req.query;

    // check if code is present
    if (!code) {
        return res.redirect(`${process.env.FRONT_END_DOMAIN}/signin?error=Authorization+code+missing`);
    }

    try {
        // exchange code for access token with axios
        const tokenRes = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        // get access token from response
        const { access_token } = tokenRes.data;

        // get user info from google cdn
        const userRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // get user data
        const { picture, email, name } = userRes.data;

        // check if user exists in database
        let user = await User.findOne({ email });

        if (user) {
            if (user.authProvider === "local") {
                return res.redirect(`${process.env.FRONT_END_DOMAIN}/signin?error=Email+already+registered+with+password.+Please+login+with+password.`);
            }
        } else {
            user = await User.create({
                name,
                email,
                profilePicture: picture,
                authProvider: "google"
            });
        }

        // generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // set in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // If user has no username, redirect to setup profile page
        if (!user.username) {
            return res.redirect(`${process.env.FRONT_END_DOMAIN}/setup-profile`);
        }
        // otherwise redirect to dashboard
        res.redirect(`${process.env.FRONT_END_DOMAIN}/dashboard`);
    } catch (err) {
        console.error("Google Auth Error:", err.response?.data || err.message);
        res.redirect(`${process.env.FRONT_END_DOMAIN}/signin?error=Google+authentication+failed`);
    }
};

// Facebook Login
export const facebookLogin = (req, res) => {
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}&scope=email,public_profile`;
    res.redirect(url);
};

// Handle Facebook Callback
export const facebookCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(`${process.env.FRONT_END_DOMAIN}/signin?error=Authorization+code+missing`);
    }

    try {
        // Exchange code for access token
        const tokenRes = await axios.get(
            `https://graph.facebook.com/v19.0/oauth/access_token`,
            {
                params: {
                    client_id: process.env.FACEBOOK_APP_ID,
                    client_secret: process.env.FACEBOOK_APP_SECRET,
                    redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
                    code,
                }
            }
        );

        const { access_token } = tokenRes.data;

        // Get user info
        const userRes = await axios.get(`https://graph.facebook.com/me`, {
            params: {
                fields: 'id,name,email,picture.type(large)',
                access_token,
            }
        });

        const { email, name, picture } = userRes.data;

        if (!email) {
            return res.redirect(`${process.env.FRONT_END_DOMAIN}/signin?error=Facebook+account+does+not+have+a+verified+email.`);
        }

        const profilePictureUrl = picture.data.url;

        let user = await User.findOne({ email });

        if (user) {
            if (user.authProvider === "local") {
                return res.redirect(`${process.env.FRONT_END_DOMAIN}/signin?error=Email+already+registered+with+password.`);
            }
        } else {
            user = await User.create({
                name,
                email,
                profilePicture: profilePictureUrl,
                authProvider: "facebook",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        if (!user.username) {
            return res.redirect(`${process.env.FRONT_END_DOMAIN}/setup-profile`);
        }
        res.redirect(`${process.env.FRONT_END_DOMAIN}/dashboard`);
    } catch (err) {
        console.error("Facebook Auth Error:", err.response?.data || err.message);
        res.redirect(`${process.env.FRONT_END_DOMAIN}/signin?error=Facebook+authentication+failed`);
    }
};

// Signup
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.authProvider !== 'local') {
                return res.status(400).json({ message: `This email is already registered with ${existingUser.authProvider}. Please login with ${existingUser.authProvider}.` });
            }
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        res.status(500).json({ message: "Signup failed" });
    }
};

// Signin
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.authProvider !== 'local') {
            return res.status(400).json({ message: `This account uses ${user.authProvider} login. Please login with ${user.authProvider}.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password is incorrect" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Signin successful" });
    } catch (err) {
        res.status(500).send({ message: "Signin failed" });
    }
};

// Signout
export const signout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });
    res.status(200).json({ message: "Signout successful" });
};

// Setup Profile (Requires Middleware to populate req.user)
export const setupProfile = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please sign in again." });
        }

        const { username } = req.body;
        // Handle both Mongoose document (_id) and plain JWT payload (id)
        const userId = req.user._id || req.user.id;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
        }

        const usernameLower = username.toLowerCase();

        const existingUser = await User.findOne({ username: usernameLower });
        if (existingUser) {
            return res.status(409).json({ message: "Username is already taken" });
        }

        const user = await User.findByIdAndUpdate(userId, { username: usernameLower }, { new: true });

        res.status(200).json({ message: "Profile setup successful", user });
    } catch (err) {
        console.error("Setup Profile Error:", err.message);
        res.status(500).json({ message: "Server error during profile setup" });
    }
};

// Delete Account (Requires Middleware to populate req.user)
export const deleteAccount = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized." });
        }
        const userId = req.user._id || req.user.id;
        await User.findByIdAndDelete(userId);
        res.clearCookie("token");
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Delete Account Error:", err.message);
        res.status(500).json({ message: "Failed to delete account" });
    }
};

// User Info (Requires Middleware)
export const getMe = (req, res) => {
    const { password, ...userData } = req.user.toObject();
    res.status(200).json({ user: userData });
};

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};