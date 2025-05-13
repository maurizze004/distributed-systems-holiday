import fs from 'fs';
import Flight from './flight.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'node:path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const flightsPath = path.join(__dirname, 'flights.json');


export async function seedFlights() {
  const count = await Flight.countDocuments();
  if (count === 0) {
    // const data = JSON.parse(fs.readFileSync('./flights.json', 'utf-8'));
    const data = JSON.parse(fs.readFileSync(flightsPath, 'utf-8'));
    await Flight.insertMany(data);
    console.log('Flüge aus JSON wurden eingefügt.');
  } else {
    console.log('Flüge sind bereits vorhanden.');
  }
}