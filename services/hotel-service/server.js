import express from 'express';
import { connectDB, config } from './db.js';
import hotelRoutes from './hotels.js';
import cors from 'cors';
import { seedHotels } from './seed.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

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
  apis: ['./services/hotel-service/hotels.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

async function startServer() {
    await connectDB();
    await seedHotels();
    app.use('/hotels', hotelRoutes);
    app.listen(config.PORT, () => {
      console.log(`Hotels läuft auf Port ${config.PORT}`);
    });
  } 
  startServer();