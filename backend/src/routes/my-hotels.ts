import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

// Create an instance of the Express Router
const router = express.Router();

// Set up multer storage in memory and file size limit for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Route to create a new hotel
router.post(
  "/",
  verifyToken,
  [
    // Validation for request body fields
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      // Extract image files and hotel data from the request
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // Upload images to cloudinary and get image URLs
      const imageUrls = await uploadImages(imageFiles);

      // Update hotel object with image URLs, lastUpdated timestamp, and userId
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // Create a new Hotel instance and save to the database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      // Respond with the created hotel object
      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Route to get all hotels belonging to the authenticated user
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    // Retrieve hotels based on the userId from the request
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// Route to get a specific hotel by ID belonging to the authenticated user
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    // Retrieve a hotel based on the hotelId and userId from the request
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// Route to update a hotel by ID
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      // Extract updated hotel data from the request
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      // Find and update the hotel in the database
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      // Handle case where the hotel is not found
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      // Extract new image files and upload to cloudinary
      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      // Combine new image URLs with existing ones in the hotel object
      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      // Save the changes to the hotel in the database
      await hotel.save();

      // Respond with the updated hotel object
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Function to asynchronously upload images to cloudinary
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    // Convert image buffer to base64 and create data URI
    const b64 = Buffer.from(image.buffer).toString("base64");
    const dataURI = "data:" + image.mimetype + ";base64," + b64;

    // Upload the image to cloudinary and return the URL
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  // Wait for all upload promises to resolve and return image URLs
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

// Export the router for use in other parts of the application
export default router;
