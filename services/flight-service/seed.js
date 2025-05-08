import fs from 'fs';
import Hotel from './flight.js';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    FILEPATH: process.env.PATH_FILES
};

export async function seedFlights() {
  const count = await Hotel.countDocuments();
  if (count === 0) {
    const data = JSON.parse(fs.readFileSync('./flights.json', 'utf-8'));
    await Hotel.insertMany(data);
    console.log('Flüge aus JSON wurden eingefügt.');
  } else {
    console.log('Flüge sind bereits vorhanden.');
  }
}