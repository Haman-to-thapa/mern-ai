import { Request, Response } from "express";

import Itinerary from "../models/Itinerary";

export const getSharedItinerary = async (
  req: Request,
  res: Response
) => {
  try {
    const { shareId } = req.params;

    if (!shareId) {
      return res.status(400).json({
        message: "Share ID is required",
      });
    }

    const itinerary =
      await Itinerary.findOne({
        shareId,
      });

    if (!itinerary) {
      return res.status(404).json({
        message: "Shared itinerary not found",
      });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch shared itinerary",
    });
  }
};