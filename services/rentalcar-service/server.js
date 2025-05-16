import express from 'express';
import { connectDB, config } from './db.js';
import carRoutes from './cars.js';
import cors from 'cors';
import { seedCars } from './seed.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();

// Swagger-Setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Hotel Service API',
    version: '1.0.0',
    description: 'API Dokumentation für den Hotel-Service',
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}`,
      description: 'Lokaler Entwicklungsserver',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./services/rentalcar-service/cars.js'], // Hier kannst du weitere Dateien ergänzen /services/hotel-service/hotels.js
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

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