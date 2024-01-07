"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing required modules and packages
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const my_hotels_1 = __importDefault(require("./routes/my-hotels"));
const hotels_1 = __importDefault(require("./routes/hotels"));
const my_bookings_1 = __importDefault(require("./routes/my-bookings"));
// Configuring Cloudinary with API credentials
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Connecting to MongoDB using the provided connection string
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
// Creating an instance of the Express application
const app = (0, express_1.default)();
// Middleware for parsing cookies
app.use((0, cookie_parser_1.default)());
// Middleware for parsing JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware for enabling CORS with specified options
app.use((0, cors_1.default)({
    // Set origin to true for any origin or specify the frontend URL
    // origin: process.env.FRONTEND_URL,
    origin: true,
    credentials: true,
}));
// Serving static files from the frontend build directory
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
// Routes for different API endpoints
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/my-hotels", my_hotels_1.default);
app.use("/api/hotels", hotels_1.default);
app.use("/api/my-bookings", my_bookings_1.default);
// Handling any other routes by serving the index.html file
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
});
// Listening on port 7000
app.listen(7000, () => {
    console.log("server running on localhost:7000");
});
