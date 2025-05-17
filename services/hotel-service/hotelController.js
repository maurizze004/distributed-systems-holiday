import Hotel from "./hotel.js";

// Get all hotels
export const getAllHotels = async (req, res) => {
    try {
        const hotelData = await Hotel.find();
        res.json(hotelData);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving hotels", error });
    }
};

// Get hotel by ID
export const getHotelById = async (req, res) => {
    const hotelId = req.params.id;
    const { query } = req.query;

    try {
        if (hotelId) {
            const hotel = await Hotel.findById(hotelId);
            if (!hotel) {
                return res.status(404).json({ message: `Hotel mit ID "${hotelId}" nicht gefunden.` });
            }
            return res.json(hotel);
        }

        if (query) {
            const hotels = await Hotel.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { location: { $regex: query, $options: 'i' } }
                ]
            });

            if (hotels.length === 0) {
                return res.status(404).json({ message: "Keine Hotels mit diesem Suchbegriff gefunden." });
            }

            return res.json(hotels);
        }

        return res.status(400).json({ message: "Bitte geben Sie eine Hotel-ID oder einen Suchbegriff an." });
    } catch (error) {
        res.status(500).json({ message: "Fehler bei der Hotelsuche", error });
    }
};


// Create a new hotel
export const createHotel = async (req, res) => {
    const hotel = new Hotel(req.body);
    try {
        const savedHotel = await hotel.save();
        res.status(201).json(savedHotel);
    } catch (error) {
        res.status(400).json({ message: "Error creating hotel", error });
    }
};

// Update a hotel
export const updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedHotel);
    } catch (error) {
        res.status(400).json({ message: "Fehler beim Aktualisieren", error });
    }
};

// Delete a hotel
export const deleteHotel = async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel nicht gefunden" });
        }
        res.json({ message: "Hotel erfolgreich gelöscht" });
    } catch (error) {
        res.status(400).json({ message: "Fehler beim Löschen des Hotels", error });
    }
};