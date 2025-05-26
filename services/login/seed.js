import fs from 'fs';
import User from './user.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'node:path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const revPath = path.join(__dirname, 'login.json');


export async function seedLogin() {
    const count = await User.countDocuments();
    if (count === 0) {
        const data = JSON.parse(fs.readFileSync(revPath, 'utf-8'));
        await User.insertMany(data);
        console.log('User aus JSON wurden eingefügt.');
    } else {
        console.log('User sind bereits vorhanden.');
    }
}