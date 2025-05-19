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
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ message: 'Löschen fehlgeschlagen', error });
  }
};

// GET flight by ID
export const getFlightById = async (req, res) => {
    const { id } = req.params;

    try {
        const flight = await Flight.findById(id);
        if (!flight) {
            return res.status(404).json({ message: "Flug nicht gefunden" });
        }
        res.json(flight);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen des Flugs", error });
    }
};