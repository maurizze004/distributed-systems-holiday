import fs from 'fs';
import Car from './car.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'node:path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const carsPath = path.join(__dirname, 'cars.json');


export async function seedCars() {
  const count = await Car.countDocuments();
  if (count === 0) {
    const data = JSON.parse(fs.readFileSync(carsPath, 'utf-8'));
    await Car.insertMany(data);
    console.log('Mietautos aus JSON wurden eingefügt.');
  } else {
    console.log('Mietautos sind bereits vorhanden.');
  }
}