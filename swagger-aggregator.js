import express from 'express';
import swaggerUi from 'swagger-ui-express';

// const swaggerUi = require('swagger-ui-express');
// const express = require('express');

const app = express();

const swaggerUrls = [
  { url: 'http://localhost:3000/api-docs/swagger.json', name: 'Flight Service' },
  { url: 'http://localhost:3001/api-docs/swagger.json', name: 'Hotel Service' },
  { url: 'http://localhost:3002/api-docs/swagger.json', name: 'Rental Car Service' },
  { url: 'http://localhost:3003/api-docs/swagger.json', name: 'Review Service' }
];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
  explorer: true,
  swaggerOptions: {
    urls: swaggerUrls
  }
}));

app.listen(4000, () => console.log('Aggregator läuft auf Port 4000'));
