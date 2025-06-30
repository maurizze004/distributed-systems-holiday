import {
    ReviewFlight,
    ReviewHotel,
    ReviewRentalCar
} from './review.js';


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

const modelMap = {
    hotel: ReviewHotel,
    flight: ReviewFlight,
    rentalcar: ReviewRentalCar
};

// export const submitReview = async (req, res) => {
//   const { username, rating, type, hotel_id, flight_id, rentalcar_id } = req.body;
//   if (rating < 0 || rating > 5)
//     return res.status(400).json({ error: "Ungültige Bewertung" });

//   const Model = modelMap[type];
//   if (!Model)
//     return res.status(400).json({ error: "Ungültiger Review-Typ" });

//   // Dynamisch das passende ID-Feld wählen
//   let filter = { username };
//   if (type === "hotel") filter.hotel_id = hotel_id;
//   if (type === "flight") filter.flight_id = flight_id;
//   if (type === "rentalcar") filter.rentalcar_id = rentalcar_id;

//   const review = await Model.findOneAndUpdate(
//     filter,
//     { rating },
//     { new: true, upsert: true }
//   );
//   res.json(review);
// };

export const getAverageRating = async (req, res) => {
  const { type, id } = req.params;
  const Model = modelMap[type];
  if (!Model)
    return res.status(400).json({ error: "Ungültiger Review-Typ" });

  // Dynamisch das passende ID-Feld wählen
  let filter = {};
  if (type === "hotel") filter.hotel_id = id;
  if (type === "flight") filter.flight_id = id;
  if (type === "rentalcar") filter.rentalcar_id = id;

  const reviews = await Model.find(filter);
  if (!reviews.length) return res.json({ average: null, count: 0 });

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = (sum / reviews.length).toFixed(1);
  res.json({ average, count: reviews.length });
};