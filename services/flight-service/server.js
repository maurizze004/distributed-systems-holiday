import express from 'express';
import { connectDB, config } from './db.js';
import flightRoutes from './flights.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectDB();

// Use Routes
app.use('/flights', flightRoutes);

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});