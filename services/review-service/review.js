import mongoose from "mongoose";

const revSchemaHotel = new mongoose.Schema({
    // id: Object,
    user: String,
    rating: Number,
    hotel_id: String
});

const revSchemaFlight = new mongoose.Schema({
    // id: Object,
    user: String,
    rating: Number,
    flight_id: String
});

const revSchemaRentalCar = new mongoose.Schema({
    // id: Object,
    user: String,
    rating: Number,
    rentalcar_id: String
});
const ReviewFlight = mongoose.model('ReviewsFlight', revSchemaFlight);
const ReviewHotel = mongoose.model('ReviewsHotel', revSchemaHotel);
const ReviewRentalCar = mongoose.model('ReviewsRentalCar', revSchemaRentalCar);

export { ReviewFlight, ReviewHotel, ReviewRentalCar };
