// Importing required modules and packages
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";

// Configuring Cloudinary with API credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connecting to MongoDB using the provided connection string
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// Creating an instance of the Express application
const app = express();

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for enabling CORS with specified options
app.use(
  cors({
    // Set origin to true for any origin or specify the frontend URL
    // origin: process.env.FRONTEND_URL,
    origin: true,
    credentials: true,
  })
);

// Serving static files from the frontend build directory
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Routes for different API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

// Handling any other routes by serving the index.html file
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Listening on port 7000
app.listen(7000, () => {
  console.log("server running on localhost:7000");
});
