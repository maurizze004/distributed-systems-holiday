import mongoose from "mongoose";

const revSchema = new mongoose.Schema({
    // id: Object,
    user: String,
    rating: Number,
    hotel_id: String
});

const Review = mongoose.model('Reviews', revSchema);

export default Review;