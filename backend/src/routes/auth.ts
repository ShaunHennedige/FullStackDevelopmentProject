import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

// Create an instance of the Express Router
const router = express.Router();

// POST route for user login
router.post(
  "/login",
  [
    // Validate email and password using express-validator
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    // Validate the request body against defined validation rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    // Extract email and password from the request body
    const { email, password } = req.body;

    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);

      // Check if the passwords match
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Create a JWT token with the user's ID and sign it with a secret key
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      // Set the token as an HTTP-only cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // 1 day in milliseconds
      });

      // Respond with the user's ID
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// GET route to validate JWT token using the verifyToken middleware
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// POST route for user logout, clears the auth_token cookie
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

// Export the router for use in other parts of the application
export default router;
