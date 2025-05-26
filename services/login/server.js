import dotenv from 'dotenv';
import express from "express";
import { connectDB, config } from "./db.js";
import userRoutes from "./users.js";
import cors from "cors";
import { seedLogin } from "./seed.js";
// import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

dotenv.config({ path: './.env', debug: true });
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Swagger-Setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Login Service API',
    version: '1.0.0',
    description: 'API Dokumentation für den Login-Service',
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
  apis: ['./services/login/users.js'], // Hier kannst du weitere Dateien ergänzen
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));


async function startServer() {
  await connectDB();
  await seedLogin();
  app.use("/users", userRoutes);
  app.listen(config.PORT, () => {
    console.log(`Server läuft auf Port ${config.PORT}`);
  });
}
startServer();
