import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    // Try to get token from cookies first, then from Authorization header
    const tokenFromCookie = req.cookies.authToken;
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.split(" ")[1];
    const token = tokenFromCookie || tokenFromHeader;

    console.log('Auth check - cookie:', !!tokenFromCookie, 'header:', !!tokenFromHeader);

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        console.log('Token decoded, userId:', decoded.userId);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ message: "Invalid token" });
    }
};
