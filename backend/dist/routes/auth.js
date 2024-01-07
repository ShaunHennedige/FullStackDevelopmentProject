"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
// Create an instance of the Express Router
const router = express_1.default.Router();
// POST route for user login
router.post("/login", [
    // Validate email and password using express-validator
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters required").isLength({
        min: 6,
    }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the request body against defined validation rules
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    // Extract email and password from the request body
    const { email, password } = req.body;
    try {
        // Find the user by email in the database
        const user = yield user_1.default.findOne({ email });
        // Check if the user exists
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // Compare the provided password with the hashed password stored in the database
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        // Check if the passwords match
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // Create a JWT token with the user's ID and sign it with a secret key
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        // Set the token as an HTTP-only cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000, // 1 day in milliseconds
        });
        // Respond with the user's ID
        res.status(200).json({ userId: user._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// GET route to validate JWT token using the verifyToken middleware
router.get("/validate-token", auth_1.default, (req, res) => {
    res.status(200).send({ userId: req.userId });
});
// POST route for user logout, clears the auth_token cookie
router.post("/logout", (req, res) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});
// Export the router for use in other parts of the application
exports.default = router;
