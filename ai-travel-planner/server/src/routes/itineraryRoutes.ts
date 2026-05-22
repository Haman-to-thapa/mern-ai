import express from "express";

import protect from "../middleware/authMiddleware";

import {
  getSingleItinerary,
  getUserItineraries,
  deleteItinerary,
} from "../controllers/itineraryController";

const router = express.Router();

router.get("/", protect, getUserItineraries);

router.get("/:id", protect, getSingleItinerary);

router.delete("/:id", protect, deleteItinerary);

export default router;