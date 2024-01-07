import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

// Create an instance of the Express Router
const router = express.Router();

// Route to get user details by decoding the JWT token
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    // Find the user by userId and exclude the password from the response
    const user = await User.findById(userId).select("-password");
    
    // Handle case where the user is not found
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Respond with the user details
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Route to register a new user
router.post(
  "/register",
  [
    // Validation for request body fields
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    // Validate request body against defined validation rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      // Check if a user with the provided email already exists
      let user = await User.findOne({
        email: req.body.email,
      });

      // Handle case where user already exists
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user instance with the request body
      user = new User(req.body);

      // Save the new user to the database
      await user.save();

      // Generate JWT token for the newly registered user
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      // Set the JWT token as a cookie in the response
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      // Respond with a success message
      return res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

// Export the router for use in other parts of the application
export default router;
