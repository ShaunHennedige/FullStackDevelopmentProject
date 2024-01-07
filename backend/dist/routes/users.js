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
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
// Create an instance of the Express Router
const router = express_1.default.Router();
// Route to get user details by decoding the JWT token
router.get("/me", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        // Find the user by userId and exclude the password from the response
        const user = yield user_1.default.findById(userId).select("-password");
        // Handle case where the user is not found
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        // Respond with the user details
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// Route to register a new user
router.post("/register", [
    // Validation for request body fields
    (0, express_validator_1.check)("firstName", "First Name is required").isString(),
    (0, express_validator_1.check)("lastName", "Last Name is required").isString(),
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters required").isLength({
        min: 6,
    }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body against defined validation rules
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        // Check if a user with the provided email already exists
        let user = yield user_1.default.findOne({
            email: req.body.email,
        });
        // Handle case where user already exists
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Create a new user instance with the request body
        user = new user_1.default(req.body);
        // Save the new user to the database
        yield user.save();
        // Generate JWT token for the newly registered user
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        // Set the JWT token as a cookie in the response
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        // Respond with a success message
        return res.status(200).send({ message: "User registered successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Export the router for use in other parts of the application
exports.default = router;
