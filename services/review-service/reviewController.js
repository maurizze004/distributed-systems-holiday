import Review from './review.js';

// GET all reviews
export const getAllRevs = async (req, res) => {
    try {
        const reviewData = await Review.find();
        res.json(reviewData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving revs', error });
    }
};

// GET rev by ID
export const getRevById = async (req, res) => {
    const { id } = req.params;

    try {
        const rev = await Review.findById(id);
        if (!rev) {
            return res.status(404).json({ message: "Review nicht gefunden" });
        }
        res.json(rev);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen des Reviews", error });
    }
};



// ADMIN: Create a new rev
export const createReview = async (req, res) => {
    const car = new Review(req.body);
    try {
        const savedReview = await car.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: 'Error creating rev', error });
    }
};

// ADMIN: Update a rev
export const updateRev = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: 'Fehler beim Aktualisieren', error });
    }
};

// ADMIN: Delete a rev
export const deleteRev = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review nicht gefunden' });
        }
        res.json({ message: 'Review erfolgreich gelöscht' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Löschen des Reviews', error });
    }
};