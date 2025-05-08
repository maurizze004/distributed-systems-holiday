import express from 'express';
import Car from './car.js';

const router = express.Router();

// Route to get all hotel
router.get('/get', async (req, res) => {
    try {
        const carData = await Car.find();
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cars', error });
    }
});

export default router;