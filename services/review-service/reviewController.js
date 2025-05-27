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

export const submitReview = async (req, res) => {
  const { username, hotel_id, rating } = req.body;
  if (rating < 0 || rating > 5)
    return res.status(400).json({ error: "Ungültige Bewertung" });

  // Update User review
  const review = await Review.findOneAndUpdate(
    { username, hotel_id },
    { rating },
    { new: true, upsert: true }
  );
  res.json(review);
};

export const getAverageRating = async (req, res) => {
  const { hotel_id } = req.params;
  const reviews = await Review.find({ hotel_id });
  if (!reviews.length) return res.json({ average: null, count: 0 });

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = (sum / reviews.length).toFixed(1);
  res.json({ average, count: reviews.length });
};
