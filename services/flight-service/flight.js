import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    id: Object,
    airline: String,
    flight_number: String,
    departure_airport: String,
    arrival_airport: String,
    departure_time: Date,
    arrival_time: Date,
    price: Number,
    seats_available: Number
});

const Flight = mongoose.model('Flights', flightSchema);

export default Flight;