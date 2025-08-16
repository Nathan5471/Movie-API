import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  tvdbId: {
    type: Number,
    required: true,
  },
  ratingsInformation: {
    ratings: [
      {
        rating: {
          type: Number,
          minimum: 1,
          maximum: 10,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    averageRating: {
      type: Number,
      minimum: 1,
      maximum: 10,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Movie", movieSchema);
