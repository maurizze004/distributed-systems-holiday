// config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import m2s from 'mongoose-to-swagger';
import Hotel from './hotel.js';

const hotelSwaggerSchema = m2s(Hotel);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel API',
      version: '1.0.0',
      description: 'API Dokumentation für das Hotel CRUD',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Passe die URL ggf. an
      },
    ],
    components : {
        schemas: {
            Hotel: hotelSwaggerSchema
        }
    }
  },
  apis: ['./services/hotel-service/hotels.js'], // Passe den Pfad zu deinen Routen an
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
