import express from 'express';
import Flight from './flight.js';

const router = express.Router();

// Route to get all flights
router.get('/get', async (req, res) => {
    try {
        const flightData = await Flight.find();
        res.json(flightData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving flights', error });
    }
});

export default router;