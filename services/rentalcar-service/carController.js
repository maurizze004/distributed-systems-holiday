import Car from './car.js';

// GET all cars
export const getAllCars = async (req, res) => {
    try {
        const carData = await Car.find();
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cars', error });
    }
};

// GET car
export const searchCars = async (req, res) => {
    const query = req.query.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Bitte geben Sie einen Suchbegriff ein.' });
    }

    try {
        const regex = new RegExp(query, 'i'); // case-insensitive

        const cars = await Car.find({
            $or: [
                { brand: regex },
                { model: regex },
                { class: regex }
            ]
        });

        if (cars.length === 0) {
            return res.status(404).json({ message: `Keine Autos gefunden für "${query}".` });
        }

        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Fehler bei der Suche nach Autos', error });
    }
};

// GET car by ID
export const getCarById = async (req, res) => {
    const { id } = req.params;

    try {
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: "Auto nicht gefunden" });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen des Autos", error });
    }
};



// ADMIN: Create a new car
export const createCar = async (req, res) => {
    const car = new Car(req.body);
    try {
        const savedCar = await car.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(400).json({ message: 'Error creating car', error });
    }
};

// ADMIN: Update a car
export const updateCar = async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCar);
    } catch (error) {
        res.status(400).json({ message: 'Fehler beim Aktualisieren', error });
    }
};

// ADMIN: Delete a car
export const deleteCar = async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) {
            return res.status(404).json({ message: 'Auto nicht gefunden' });
        }
        res.json({ message: 'Auto erfolgreich gelöscht' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Löschen des Autos', error });
    }
};