import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Signup
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Signup request received with data:", { username, email });
        
        // Validate inputs
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log("User already exists:", { username, email });
            return res.status(400).json({ message: "Email or username already registered" });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();
        console.log("User saved to database:", newUser._id);

        // Create JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" }
        );

        console.log("Token created for user:", newUser._id);
        
        // Set httpOnly cookie
      res.cookie('authToken', token, {
    httpOnly: true,
    // Keep secure: true for production
    secure: process.env.NODE_ENV === 'production', 
    // CHANGE THIS: 'none' is required for cross-site cookies
    sameSite: 'none', 
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
});
        
        console.log('Cookie set in response');
        
        res.status(201).json({
            message: "User created successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Login
// Logout  
export const logout = async (req, res) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        console.log('Cookie cleared on logout');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords using bcrypt
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" }
        );

        // Set httpOnly cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        console.log('Cookie set in response for user:', user._id);
        
        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
