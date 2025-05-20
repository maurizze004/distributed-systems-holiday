import fs from 'fs';
import Review from './review.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'node:path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const revPath = path.join(__dirname, 'reviews.json');


export async function seedReviews() {
    const count = await Review.countDocuments();
    if (count === 0) {
        const data = JSON.parse(fs.readFileSync(revPath, 'utf-8'));
        await Review.insertMany(data);
        console.log('Reviews aus JSON wurden eingefügt.');
    } else {
        console.log('Reviews sind bereits vorhanden.');
    }
}