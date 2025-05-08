import fs from 'fs';
import Hotel from './hotel.js';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    FILEPATH: process.env.PATH_FILES
};

export async function seedHotels() {
  const count = await Hotel.countDocuments();
  if (count === 0) {
    const data = JSON.parse(fs.readFileSync('./hotels.json', 'utf-8'));
    await Hotel.insertMany(data);
    console.log('Hotels aus JSON wurden eingefügt.');
  } else {
    console.log('Hotels sind bereits vorhanden.');
  }
}