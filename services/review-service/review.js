import mongoose from "mongoose";

const revSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels",
      required: true,
    },
    rating: { type: Number, min: 0, max: 5, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Reviews", revSchema);

export default Review;