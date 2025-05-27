async function loadHotels(sortOption = 'default') {
    const container = document.getElementById('hotel-container');
    container.innerHTML = '';
    try {
        const [hotelsRes, reviewsRes] = await Promise.all([
            fetch('http://localhost:3001/hotels/get'),
            fetch('http://localhost:3003/reviews/get'),
        ]);
        if (!hotelsRes.ok || !reviewsRes.ok) throw new Error('Fehler beim Laden von Hoteldaten oder Bewertungen');
        let hotels = await hotelsRes.json();
        const reviews = await reviewsRes.json();

        // Durchschnittsbewertung pro Hotel berechnen
        const reviewMap = {};
        // User-Bewertung pro Hotel speichern
        const username = localStorage.getItem('username');
        const userReviewMap = {};

        reviews.forEach(review => {
            if (!reviewMap[review.hotel_id]) {
                reviewMap[review.hotel_id] = { totalRating: 0, count: 0 };
            }
            reviewMap[review.hotel_id].totalRating += review.rating;
            reviewMap[review.hotel_id].count += 1;

            if (review.username === username) {
                userReviewMap[review.hotel_id] = review.rating;
            }
        });

        Object.keys(reviewMap).forEach(hotelId => {
            reviewMap[hotelId].average = (reviewMap[hotelId].totalRating / reviewMap[hotelId].count).toFixed(1);
        });

        const favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];

        // Sortierung
        switch (sortOption) {
            case 'price-asc':
                hotels.sort((a, b) => a.price_per_night - b.price_per_night);
                break;
            case 'price-desc':
                hotels.sort((a, b) => b.price_per_night - a.price_per_night);
                break;
            case 'star-asc':
                hotels.sort((a, b) => a.stars - b.stars);
                break;
            case 'star-desc':
                hotels.sort((a, b) => b.stars - a.stars);
                break;
            case 'default':
            default:
                break;
        }

        hotels.forEach(hotel => {
            const averageRating = reviewMap[hotel._id]?.average || 'Keine Bewertungen';
            const reviewCount = reviewMap[hotel._id]?.count || 0;
            const userRating = userReviewMap[hotel._id] || 0;
            const isFavorited = favoriteHotels.some(favHotel => favHotel._id === hotel._id);

            // Durchschnittssterne
            function renderAverageStars(avg) {
                if (isNaN(avg)) return '';
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    starsHtml += `<span class="star${avg >= i ? ' filled' : ''}">&#9733;</span>`;
                }
                return starsHtml;
            }

            // Interaktive Sterne für User-Bewertung
            function renderUserStars(hotelId, userRating) {
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    const classes = ['star'];
                    if (userRating >= i) classes.push('user-rating');
                    starsHtml += `<span class="${classes.join(' ')}" data-rating="${i}" data-hotel-id="${hotelId}">&#9733;</span>`;
                }
                return starsHtml;
            }

            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card hotel-card">
                  <div class="favorite-icon" style="position: absolute; top: 10px; right: 10px; z-index: 2;">
                    <i class="bi ${isFavorited ? 'bi-heart-fill' : 'bi-heart'}" data-hotel-id="${hotel._id}" style="font-size: 1.5rem; color: ${isFavorited ? 'red' : 'gray'}; cursor: pointer;"></i>
                  </div>
                  <img src="${hotel.image_url || 'https://source.unsplash.com/featured/?hotel'}" alt="Hotelbild">
                  <div class="hotel-info">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="hotel-name">${hotel.name}</div>
                        <div class="hotel-rating">${hotel.stars ? '★'.repeat(hotel.stars) : 'Keine Kategorie'}</div>
                    </div>
                    <div class="hotel-location">${hotel.location}</div>
                    <div class="hotel-price">ab ${hotel.price_per_night.toFixed(2)} € / Nacht</div>
                    <div class="hotel-reviews">
                        <div class="average-stars">${renderAverageStars(Number(averageRating))}</div>
                        <div>${averageRating} / 5.0 von ${reviewCount} Bewertung(en)</div>
                    </div>
                    <div class="rating-section">
                        <div class="star-rating" data-hotel-id="${hotel._id}">
                            ${renderUserStars(hotel._id, userRating)}
                        </div>
                        <div class="rating-feedback" id="feedback-${hotel._id}"></div>
                        <div class="user-rating-label">
                            ${userRating ? `Deine Bewertung: ${userRating} / 5` : 'Noch nicht bewertet'}
                        </div>
                    </div>
                  </div>
                </div>
            `;

            container.appendChild(col);

            // Sterne-Interaktion
            const starRatingDiv = col.querySelector('.star-rating');
            if (starRatingDiv) {
                const stars = starRatingDiv.querySelectorAll('.star');
                stars.forEach(star => {
                    star.addEventListener('mouseenter', function () {
                        const rating = parseInt(this.dataset.rating);
                        stars.forEach((s, idx) => {
                            s.classList.toggle('filled', idx < rating);
                        });
                    });
                    star.addEventListener('mouseleave', function () {
                        stars.forEach((s, idx) => {
                            s.classList.toggle('filled', userRating >= idx + 1);
                        });
                    });
                    star.addEventListener('click', async function () {
                        const rating = parseInt(this.dataset.rating);
                        const hotelId = this.dataset.hotelId;
                        // Bewertung absenden
                        const res = await fetch('http://localhost:3003/reviews/submit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, hotel_id: hotelId, rating })
                        });
                        if (res.ok) {
                            document.getElementById(`feedback-${hotelId}`).textContent = `Danke für deine Bewertung (${rating} Sterne)!`;
                            setTimeout(() => loadHotels(), 1000); // Nach Bewertung neu laden
                        } else {
                            const errorMsg = await res.text();
                            document.getElementById(`feedback-${hotelId}`).textContent = 'Fehler beim Bewerten: ' + errorMsg;
                        }
                    });
                });
                // Initial: Eigene Bewertung hervorheben
                stars.forEach((star, idx) => {
                    if (userRating >= idx + 1) star.classList.add('user-rating');
                });
            }
        });
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">Fehler: ${error.message}</div>`;
    }
}

// Beispiel: Sortieroptionen anbinden
document.getElementById('sort-select')?.addEventListener('change', e => {
    loadHotels(e.target.value);
});

// Initiales Laden
loadHotels();
