import fs from 'fs';
import Car from './car.js';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    FILEPATH: process.env.PATH_FILES
};

export async function seedCars() {
  const count = await Car.countDocuments();
  if (count === 0) {
    const data = JSON.parse(fs.readFileSync('./car.json', 'utf-8'));
    await Car.insertMany(data);
    console.log('Cars aus JSON wurden eingefügt.');
  } else {
    console.log('Cars sind bereits vorhanden.');
  }
}