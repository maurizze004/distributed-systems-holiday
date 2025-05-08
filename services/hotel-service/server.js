import express from 'express';
import { connectDB, config } from './db.js';
import hotelRoutes from './hotels.js';
import cors from 'cors';


const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Use Routes
app.use('/hotels', hotelRoutes);

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});