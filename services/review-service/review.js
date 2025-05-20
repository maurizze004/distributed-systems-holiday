import mongoose from "mongoose";

const revSchema = new mongoose.Schema({
    // id: Object,
    brand: String,
    model: String,
    power: String,
    year: Number,
    daily_rate: Number,
    fuel_type: String,
    is_available: Boolean,
    occupied_until: Date,
    imageUrl: String,
    class: String
});

const Review = mongoose.model('Reviews', revSchema);

export default Review;