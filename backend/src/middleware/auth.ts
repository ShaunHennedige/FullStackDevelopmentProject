import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extending the Express Request interface to include userId property
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// Middleware function to verify the JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Retrieving the token from cookies
  const token = req.cookies["auth_token"];
  
  // Checking if the token exists
  if (!token) {
    // If token is missing, respond with unauthorized status
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    // Verifying the token using the JWT_SECRET_KEY from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    // Setting userId property in the request based on the decoded JWT payload
    req.userId = (decoded as JwtPayload).userId;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // If token verification fails, respond with unauthorized status
    return res.status(401).json({ message: "unauthorized" });
  }
};

// Exporting the middleware function
export default verifyToken;
