import express from 'express';
import { connectDB, config } from './db.js';
import carRoutes from './cars.js';
import cors from 'cors';
import { seedCars } from './seed.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

async function startServer() {
    await connectDB();
    await seedCars();
    app.use('/cars', carRoutes);
    app.listen(config.PORT, () => {
      console.log(`Server läuft auf Port ${config.PORT}`);
    });
  }
  
  startServer();