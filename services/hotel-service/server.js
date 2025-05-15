import express from 'express';
import { connectDB, config } from './db.js';
import hotelRoutes from './hotels.js';
import cors from 'cors';
import { seedHotels } from './seed.js';
import swaggerSetup from './swagger.js'

const app = express();
app.use(express.json());
app.use(cors());

swaggerSetup(app)

async function startServer() {
  await connectDB();
  await seedHotels();
  app.use('/hotels', hotelRoutes);
  app.listen(config.PORT, () => {
    console.log(`Server läuft auf Port ${config.PORT}`);
  });
}

startServer();
