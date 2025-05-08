import express from 'express';
import { connectDB, config } from './db.js';
import flightRoutes from './flights.js';
import cors from 'cors';
import { seedFlights } from './seed.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

async function startServer() {
    await connectDB();
    await seedFlights();
    app.use('/flights', flightRoutes);
    app.listen(config.PORT, () => {
      console.log(`Server läuft auf Port ${config.PORT}`);
    });
  }
  
  startServer();