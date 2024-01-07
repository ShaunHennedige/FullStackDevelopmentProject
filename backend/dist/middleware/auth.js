"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware function to verify the JWT token
const verifyToken = (req, res, next) => {
    // Retrieving the token from cookies
    const token = req.cookies["auth_token"];
    // Checking if the token exists
    if (!token) {
        // If token is missing, respond with unauthorized status
        return res.status(401).json({ message: "unauthorized" });
    }
    try {
        // Verifying the token using the JWT_SECRET_KEY from environment variables
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // Setting userId property in the request based on the decoded JWT payload
        req.userId = decoded.userId;
        // Proceed to the next middleware or route
        next();
    }
    catch (error) {
        // If token verification fails, respond with unauthorized status
        return res.status(401).json({ message: "unauthorized" });
    }
};
// Exporting the middleware function
exports.default = verifyToken;
