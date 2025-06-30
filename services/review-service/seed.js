import fs from 'fs';
import {
    ReviewFlight,
    ReviewHotel,
    ReviewRentalCar
} from './review.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'node:path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const revPath = path.join(__dirname, 'reviews.json');


export async function seedReviews() {
  const countHotel = await ReviewHotel.countDocuments();
  const countFlight = await ReviewFlight.countDocuments();
  const countRentalCar = await ReviewRentalCar.countDocuments();

  if (countHotel === 0 && countFlight === 0 && countRentalCar === 0) {
    const data = JSON.parse(fs.readFileSync(revPath, 'utf-8'));

    if (data.hotel_reviews) {
      await ReviewHotel.insertMany(data.hotel_reviews);
    }
    if (data.flight_reviews) {
      await ReviewFlight.insertMany(data.flight_reviews);
    }
    if (data.rentalcar_reviews) {
      await ReviewRentalCar.insertMany(data.rentalcar_reviews);
    }

    console.log('Reviews aus JSON wurden eingefügt.');
  } else {
    console.log('Reviews sind bereits vorhanden.');
  }
}