import express from 'express';
import Car from './car.js';

const router = express.Router();

// Route to get all cars
router.get('/get', async (req, res) => {
    try {
        const carData = await Car.find();
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cars', error });
    }
});

// Route to search cars by brand, model, or class
router.get('/find', async (req, res) => {
    try {
        const { query } = req.query;

        // Überprüfen, ob ein Suchbegriff übergeben wurde
        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        // Case-insensitive Suche basierend auf brand, model oder class
        const cars = await Car.find({
            $or: [
                { brand: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } },
                { class: { $regex: query, $options: 'i' } }
            ]
        });

        // Ergebnis zurückgeben
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error searching cars', error });
    }
});

export default router;