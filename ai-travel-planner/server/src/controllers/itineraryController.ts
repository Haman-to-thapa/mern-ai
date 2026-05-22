import { Response } from "express";

import Itinerary from "../models/Itinerary";

import { CustomRequest } from "../middleware/authMiddleware";

export const getUserItineraries = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const itineraries = await Itinerary.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch itineraries",
    });
  }
};

export const deleteItinerary = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found",
      });
    }

    res.status(200).json({
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete itinerary",
    });
  }
};

export const getSingleItinerary = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found",
      });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch itinerary",
    });
  }
};