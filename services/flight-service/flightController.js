import Flight from "./flight.js";

// GET all flights
export const getAllFlights = async (req, res) => {
    try {
        const flightData = await Flight.find();
        res.json(flightData);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving flights", error });
    }
};

// GET flight by ID
export const getFlightById = async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ message: "Bitte geben Sie eine Stadt für die Suche an." });
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
};        

// ADMIN: Create a new flight
export const createFlight = async (req, res) => {
    const flight = new Flight(req.body);
    try {
        const savedFlight = await flight.save();
        res.status(201).json(savedFlight);
    } catch (error) {
        res.status(400).json({ message: "Error creating flight", error });
    }
};

// ADMIN: Update a flight
export const updateFlight = async (req, res) => {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFlight);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren', error });
  }
};

// ADMIN: Delete a flight 
export const deleteFlight = async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Löschen fehlgeschlagen', error });
  }
};
