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

// Route to search flights by city
router.get('/find', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({message: 'Bitte geben Sie eine Stadt für die Suche an.'});
    }

    try {
        const flights = await Flight.find({
            arrival_airport: {$regex: city, $options: 'i'}
        });

        if (flights.length === 0) {
            return res.status(404).json({message: `Keine Flüge für die Stadt "${city}" gefunden.`});
        }

        res.json(flights);
    } catch (error) {
        res.status(500).json({message: 'Fehler bei der Suche nach Flügen', error});
    }
});

export default router;