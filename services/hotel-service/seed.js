import fs from 'fs';
import Hotel from './hotel.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'node:path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hotelsPath = path.join(__dirname, 'hotels.json');


export async function seedHotels() {
  const count = await Hotel.countDocuments();
  if (count === 0) {
    // const data = JSON.parse(fs.readFileSync('./flights.json', 'utf-8'));
    const data = JSON.parse(fs.readFileSync(hotelsPath, 'utf-8'));
    await Hotel.insertMany(data);
    console.log('Hotels aus JSON wurden eingefügt.');
  } else {
    console.log('Hotels sind bereits vorhanden.');
  }
}