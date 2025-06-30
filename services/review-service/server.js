import express from 'express';
import { connectDB, config } from './db.js';
import revRoutes from './reviews.js';
import cors from 'cors';
import { seedReviews } from './seed.js';

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
        title: 'Review Service API',
        version: '1.0.0',
        description: 'API Dokumentation für den Review-Service',
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
    apis: ['./services/review-service/reviews.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

async function startServer() {
    await connectDB();
    await seedReviews();
    app.use('/reviews', revRoutes);
    app.listen(config.PORT, () => {
        console.log(`Review läuft auf Port ${config.PORT}`);
    });
}
startServer();