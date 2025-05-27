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

        const reviewMap = {};
        reviews.forEach(review => {
            if (!reviewMap[review.hotel_id]) {
                reviewMap[review.hotel_id] = {totalRating: 0, count: 0};
            }
            reviewMap[review.hotel_id].totalRating += review.rating;
            reviewMap[review.hotel_id].count += 1;
        });

        Object.keys(reviewMap).forEach(hotelId => {
            reviewMap[hotelId].average = (reviewMap[hotelId].totalRating / reviewMap[hotelId].count).toFixed(1);
        });

        const favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];

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

            const isFavorited = favoriteHotels.some(favHotel => favHotel._id === hotel._id);

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
                    <div class="hotel-reviews">${averageRating} / 5.0 von ${reviewCount} Bewertung(en)</div>
                  </div>
                </div>
            `;

            container.appendChild(col);
        });

        document.querySelectorAll('.favorite-icon i').forEach(icon => {
            icon.addEventListener('click', event => {
                const hotelId = event.target.getAttribute('data-hotel-id');
                toggleFavoriteHotel(hotelId, hotels);
            });
        });

    } catch (error) {
        console.error('Fehler beim Laden der Hotels:', error);
        container.innerHTML = `<p class="text-danger">Fehler: ${error.message}</p>`;
    }
}

function toggleFavoriteHotel(hotelId, hotels) {
    let favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];
    const hotel = hotels.find(h => h._id === hotelId);

    if (favoriteHotels.some(favHotel => favHotel._id === hotelId)) {
        favoriteHotels = favoriteHotels.filter(favHotel => favHotel._id !== hotelId);
    } else {
        favoriteHotels.push(hotel);
    }

    localStorage.setItem('favoriteHotels', JSON.stringify(favoriteHotels));

    renderFavoriteHotels();

    loadHotels();
}
function renderFavoriteHotels() {
    const favHotelsContainer = document.getElementById('fav-hotels');
    if (!favHotelsContainer) return;

    const favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];
    favHotelsContainer.innerHTML = '';

    if (favoriteHotels.length === 0) {
        favHotelsContainer.innerHTML = '<p class="text-muted">Keine favorisierten Hotels gefunden.</p>';
        return;
    }

    favoriteHotels.forEach(hotel => {
        const favHotelItem = document.createElement('li');
        favHotelItem.className = 'list-group-item';
        favHotelItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${hotel.name} - ${hotel.location}</span>
                <i class="bi bi-trash" style="cursor: pointer;" data-hotel-id="${hotel._id}"></i>
            </div>
        `;

        favHotelItem.querySelector('.bi-trash').addEventListener('click', () => {
            toggleFavoriteHotel(hotel._id, []);
        });

        favHotelsContainer.appendChild(favHotelItem);
    });
}

document.getElementById('sort-hotel-option').addEventListener('change', event => {
    const selectedOption = event.target.value;
    loadHotels(selectedOption);
});
document.getElementById('search-hotel-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-hotel-input').value.trim();
    searchHotels(searchInput);
});
document.addEventListener('DOMContentLoaded', () => {
    loadHotels();
    renderFavoriteHotels();
});