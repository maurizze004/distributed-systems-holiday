import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    id: Object,
    country: String,
    city: String,
    name: String,
    street: String,
    number: String,
    price: Number,
    rooms_available: Number
});

const Hotel = mongoose.model('Hotels', hotelSchema);

export default Hotel;