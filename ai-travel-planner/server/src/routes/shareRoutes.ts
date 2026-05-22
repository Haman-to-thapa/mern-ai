import express from "express";

import { getSharedItinerary } from "../controllers/shareController";

const router = express.Router();

router.get("/:shareId", getSharedItinerary);

export default router;