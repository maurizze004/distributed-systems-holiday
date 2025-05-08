import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  id: Object,
  brand: String,
  model: String,
  power: String,
  year: Number,
  daily_rate: Number,
  fuel_type: String,
  is_available: Boolean,
  occupied_until: Date,
  imageUrl: String // z.B. '/uploads/cars/123.jpg' oder eine externe URL
});

const Car = mongoose.model('Cars', carSchema);

export default Car;