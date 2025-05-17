import express from 'express';
import { connectDB, config } from './db.js';
import flightRoutes from './flights.js';
import cors from 'cors';
import { seedFlights } from './seed.js';

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
    title: 'Flight Service API',
    version: '1.0.0',
    description: 'API Dokumentation für den Flight-Service',
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
  apis: ['./services/flight-service/flights.js'], // Hier kannst du weitere Dateien ergänzen /services/flight-service/flights.js
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

async function startServer() {
    await connectDB();
    await seedFlights();
    app.use('/flights', flightRoutes);
    app.listen(config.PORT, () => {
      console.log(`Server läuft auf Port ${config.PORT}`);
    });
  }
  
  startServer();