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
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const hotel_1 = __importDefault(require("../models/hotel"));
const auth_1 = __importDefault(require("../middleware/auth"));
const express_validator_1 = require("express-validator");
// Create an instance of the Express Router
const router = express_1.default.Router();
// Set up multer storage in memory and file size limit for image uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
// Route to create a new hotel
router.post("/", auth_1.default, [
    // Validation for request body fields
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Hotel type is required"),
    (0, express_validator_1.body)("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage("Price per night is required and must be a number"),
    (0, express_validator_1.body)("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities are required"),
], upload.array("imageFiles", 6), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract image files and hotel data from the request
        const imageFiles = req.files;
        const newHotel = req.body;
        // Upload images to cloudinary and get image URLs
        const imageUrls = yield uploadImages(imageFiles);
        // Update hotel object with image URLs, lastUpdated timestamp, and userId
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;
        // Create a new Hotel instance and save to the database
        const hotel = new hotel_1.default(newHotel);
        yield hotel.save();
        // Respond with the created hotel object
        res.status(201).send(hotel);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// Route to get all hotels belonging to the authenticated user
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve hotels based on the userId from the request
        const hotels = yield hotel_1.default.find({ userId: req.userId });
        res.json(hotels);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
}));
// Route to get a specific hotel by ID belonging to the authenticated user
router.get("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id.toString();
    try {
        // Retrieve a hotel based on the hotelId and userId from the request
        const hotel = yield hotel_1.default.findOne({
            _id: id,
            userId: req.userId,
        });
        res.json(hotel);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
}));
// Route to update a hotel by ID
router.put("/:hotelId", auth_1.default, upload.array("imageFiles"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract updated hotel data from the request
        const updatedHotel = req.body;
        updatedHotel.lastUpdated = new Date();
        // Find and update the hotel in the database
        const hotel = yield hotel_1.default.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, { new: true });
        // Handle case where the hotel is not found
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        // Extract new image files and upload to cloudinary
        const files = req.files;
        const updatedImageUrls = yield uploadImages(files);
        // Combine new image URLs with existing ones in the hotel object
        hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];
        // Save the changes to the hotel in the database
        yield hotel.save();
        // Respond with the updated hotel object
        res.status(201).json(hotel);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// Function to asynchronously upload images to cloudinary
function uploadImages(imageFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadPromises = imageFiles.map((image) => __awaiter(this, void 0, void 0, function* () {
            // Convert image buffer to base64 and create data URI
            const b64 = Buffer.from(image.buffer).toString("base64");
            const dataURI = "data:" + image.mimetype + ";base64," + b64;
            // Upload the image to cloudinary and return the URL
            const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            return res.url;
        }));
        // Wait for all upload promises to resolve and return image URLs
        const imageUrls = yield Promise.all(uploadPromises);
        return imageUrls;
    });
}
// Export the router for use in other parts of the application
exports.default = router;
