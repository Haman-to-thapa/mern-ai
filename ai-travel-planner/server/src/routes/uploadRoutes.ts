import express from "express";
import protect from "../middleware/authMiddleware";

import upload from "../middleware/uploadMiddleware";

import { uploadFile } from "../controllers/uploadController";



const router = express.Router();


router.post(
  "/",
  protect,
  upload.single("document"),
  uploadFile
);

export default router;