import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    extractedText: {
      type: String,
    },

    itinerary: {
      type: Object,
    },

    uploadedFile: {
      type: String,
    },

    shareId: {
  type: String,
},
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model(
  "Itinerary",
  itinerarySchema
);

export default Itinerary;