import { Request, Response } from "express";
import fs from "fs/promises";

import extractPdfText from "../services/pdfService";

import extractImageText from "../services/ocrService";

import generateItinerary from "../services/aiService";

import Itinerary from "../models/Itinerary";
import { CustomRequest } from "../middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";


export const uploadFile = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    console.log("File path from multer:", file.path);
    console.log("File exists check:", await fs.stat(file.path).then(() => "yes").catch(() => "no"));

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      extractedText = await extractPdfText(
        file.path
      );
    } else {
      extractedText = await extractImageText(
        file.path
      );
    }

  console.log("Extracted text length:", extractedText.length);
  console.log("Extracted text preview:", extractedText.substring(0, 300));

  const itineraryData = await generateItinerary(
  extractedText
);

const savedItinerary = await Itinerary.create({
  user: req.user._id,
  extractedText,
  itinerary: itineraryData,
  shareId: uuidv4(),
});

try {
  await fs.unlink(file.path);
  console.log("Uploaded file deleted:", file.path);
} catch (cleanupErr) {
  console.warn("Failed to delete uploaded file (may already be cleaned):", file.path);
}

res.status(200).json({
  message: "Itinerary generated successfully",
  data: savedItinerary,
});

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Extraction failed";
    console.error("Upload error:", msg);
    if (error instanceof Error && error.stack) console.error(error.stack);

    res.status(500).json({
      message: msg,
    });
  }
};