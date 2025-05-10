import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: String,
    location: String,
    stars: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    price_per_night: Number,
    amenities: {
        type: [String],
        default: []
    },
    available_rooms: {
        type: Number,
        default: 0
    },
    description: String,
    image_url: {
        type: String,
        default: 'https://source.unsplash.com/featured/?hotel'
    }
});

const Hotel = mongoose.model('Hotels', hotelSchema);

export default Hotel;