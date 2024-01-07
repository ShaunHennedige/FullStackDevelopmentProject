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
const hotel_1 = __importDefault(require("../models/hotel"));
const express_validator_1 = require("express-validator");
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = __importDefault(require("../middleware/auth"));
// Create an instance of the Express Router
const router = express_1.default.Router();
// Initialize Stripe with the API key from the environment variables
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
// Route for searching hotels
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Construct search query based on request parameters
        const query = constructSearchQuery(req.query);
        // Set sort options based on the specified sortOption
        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }
        // Set pagination parameters
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        // Retrieve hotels based on the constructed query and sort options
        const hotels = yield hotel_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);
        // Get the total count of hotels for pagination
        const total = yield hotel_1.default.countDocuments(query);
        // Prepare the response object with hotel data and pagination details
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        // Send the response
        res.json(response);
    }
    catch (error) {
        console.error("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// Route to get all hotels
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all hotels and sort by lastUpdated in descending order
        const hotels = yield hotel_1.default.find().sort("-lastUpdated");
        res.json(hotels);
    }
    catch (error) {
        console.error("error", error);
        res.status(500).json({ message: "Error fetching hotels" });
    }
}));
// Route to get a specific hotel by ID
router.get("/:id", [(0, express_validator_1.param)("id").notEmpty().withMessage("Hotel ID is required")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate hotel ID parameter
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Extract hotel ID from the request parameters
    const id = req.params.id.toString();
    try {
        // Retrieve the hotel by ID
        const hotel = yield hotel_1.default.findById(id);
        // Send the hotel data in the response
        res.json(hotel);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching hotel" });
    }
}));
// Route to create a payment intent for hotel booking
router.post("/:hotelId/bookings/payment-intent", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract necessary data from the request body
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    // Retrieve the hotel based on the provided hotel ID
    const hotel = yield hotel_1.default.findById(hotelId);
    // Check if the hotel exists
    if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
    }
    // Calculate the total cost for the booking
    const totalCost = hotel.pricePerNight * numberOfNights;
    // Create a payment intent using the Stripe API
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "gbp",
        metadata: {
            hotelId,
            userId: req.userId,
        },
    });
    // Check if the payment intent has a client secret
    if (!paymentIntent.client_secret) {
        return res
            .status(500)
            .json({ message: "Error creating payment intent" });
    }
    // Prepare the response with payment intent details
    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
    };
    // Send the response
    res.send(response);
}));
// Route to create a new booking for a hotel
router.post("/:hotelId/bookings", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract payment intent ID from the request body
        const paymentIntentId = req.body.paymentIntentId;
        // Retrieve payment intent details from Stripe
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        // Check if the payment intent exists
        if (!paymentIntent) {
            return res.status(400).json({ message: "payment intent not found" });
        }
        // Check if hotel ID and user ID match the payment intent metadata
        if (paymentIntent.metadata.hotelId !== req.params.hotelId ||
            paymentIntent.metadata.userId !== req.userId) {
            return res.status(400).json({ message: "payment intent mismatch" });
        }
        // Check if the payment intent has succeeded
        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
            });
        }
        // Create a new booking object with user ID
        const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
        // Find the hotel by ID and push the new booking to its bookings array
        const hotel = yield hotel_1.default.findOneAndUpdate({ _id: req.params.hotelId }, {
            $push: { bookings: newBooking },
        });
        // Check if the hotel exists
        if (!hotel) {
            return res.status(400).json({ message: "hotel not found" });
        }
        // Save the changes to the hotel
        yield hotel.save();
        // Respond with a success status
        res.status(200).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "something went wrong" });
    }
}));
// Function to construct a MongoDB query based on search parameters
const constructSearchQuery = (queryParams) => {
    let constructedQuery = {};
    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }
    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }
    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }
    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }
    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }
    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star) => parseInt(star))
            : parseInt(queryParams.stars);
        constructedQuery.starRating = { $in: starRatings };
    }
    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }
    return constructedQuery;
};
// Export the router for use in other parts of the application
exports.default = router;
