async function loadHotels(sortOption = 'default') {
    const container = document.getElementById('hotel-container');
    container.innerHTML = '';
    try {
        // 1. Hotels laden
        const hotelsRes = await fetch('http://localhost:3001/hotels/get');
        if (!hotelsRes.ok) throw new Error('Fehler beim Laden von Hoteldaten');
        const hotels = await hotelsRes.json();

        // 2. Für jedes Hotel Durchschnittsbewertung holen (API gibt {average, count} zurück)
        const reviewPromises = hotels.map(hotel =>
            fetch(`http://localhost:3003/reviews/getaverage/hotel/${hotel._id}`)
        );
        const reviewResponses = await Promise.all(reviewPromises);
        const reviews = await Promise.all(reviewResponses.map(res => res.json()));

        // 3. Map mit Hotel-ID als Schlüssel bauen
        const reviewMap = {};
        hotels.forEach((hotel, idx) => {
            reviewMap[hotel._id] = {
                average: reviews[idx].average,
                count: reviews[idx].count
            };
        });

        // 4. Favoriten laden
        const favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];

        // 5. Sortierung der Hotels
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

        // 6. Hotels rendern
        hotels.forEach((hotel) => {
            const averageRating =
                reviewMap[hotel._id]?.average !== null &&
                    reviewMap[hotel._id]?.average !== undefined
                    ? reviewMap[hotel._id].average
                    : "Keine Bewertungen";
            const reviewCount = reviewMap[hotel._id]?.count || 0;

            const isFavorited = favoriteHotels.some((favHotel) => favHotel._id === hotel._id);

            // Sterne-Rendering (optional)
            function renderAverageStars(avg) {
                if (!avg || isNaN(avg)) return "";
                let starsHtml = "";
                for (let i = 1; i <= 5; i++) {
                    starsHtml += `<span style="color:${i <= Math.round(avg) ? "#FFD700" : "#ccc"
                        }">★</span>`;
                }
                return starsHtml;
            }

            const card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
        <div class="card hotel-card">
                  <div class="favorite-icon" style="position: absolute; top: 10px; right: 10px; z-index: 2;">
                    <i class="bi ${isFavorited ? "bi-heart-fill" : "bi-heart"
                }" data-hotel-id="${hotel._id
                }" style="font-size: 1.5rem; color: ${isFavorited ? "red" : "gray"
                }; cursor: pointer;"></i>
                  </div>
                  <img src="${hotel.image_url ||
                "https://source.unsplash.com/featured/?hotel"
                }" alt="Hotelbild">
                  <div class="hotel-info">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="hotel-name">${hotel.name}</div>
                        <div class="hotel-rating">${hotel.stars
                    ? "★".repeat(hotel.stars)
                    : "Keine Kategorie"
                }</div>
                    </div>
                    <div class="hotel-location">${hotel.location}</div>
                    <div class="hotel-price">ab ${hotel.price_per_night.toFixed(
                    2
                )} € / Nacht</div>
                    <div class="hotel-reviews">
                        <div class="average-stars">${renderAverageStars(
                    Number(averageRating)
                )}</div>
                        <div>${averageRating} / 5.0 von ${reviewCount} Bewertung(en)</div>
                    </div>
                  </div>
                </div>
      `;
            container.appendChild(card);
        });
        document.querySelectorAll(".favorite-icon").forEach((icon) => {
            icon.addEventListener("click", event => {
                const hotelId = event.target.getAttribute("data-hotel-id");
                toggleFavoriteHotel(hotelId, hotels);
            });
        });
    } catch (error) {
        console.error('Fehler:', error);
        container.innerHTML = `<div class="alert alert-danger">Fehler: ${error.message}</div>`;
    };
}

async function searchHotels(query, sortOption = 'default') {
    const container = document.getElementById('hotel-container');
    container.innerHTML = '';
    try {
        // 1. Hotels laden
        const hotelsRes = await fetch('http://localhost:3001/hotels/find?query=' + encodeURIComponent(query));
        if (!hotelsRes.ok) throw new Error('Fehler beim Laden von Hoteldaten');
        const hotels = await hotelsRes.json();
        if (hotels.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Hotels gefunden</p>';
            return;
        } else {
                    // 2. Für jedes Hotel Durchschnittsbewertung holen (API gibt {average, count} zurück)
        const reviewPromises = hotels.map(hotel =>
            fetch(`http://localhost:3003/reviews/getaverage/hotel/${hotel._id}`)
        );
        const reviewResponses = await Promise.all(reviewPromises);
        const reviews = await Promise.all(reviewResponses.map(res => res.json()));

        // 3. Map mit Hotel-ID als Schlüssel bauen
        const reviewMap = {};
        hotels.forEach((hotel, idx) => {
            reviewMap[hotel._id] = {
                average: reviews[idx].average,
                count: reviews[idx].count
            };
        });

        // 4. Favoriten laden
        const favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];

        // 5. Sortierung (wie gehabt)
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

        // 6. Hotels rendern
        hotels.forEach((hotel) => {
            const averageRating =
                reviewMap[hotel._id]?.average !== null &&
                    reviewMap[hotel._id]?.average !== undefined
                    ? reviewMap[hotel._id].average
                    : "Keine Bewertungen";
            const reviewCount = reviewMap[hotel._id]?.count || 0;

            const isFavorited = favoriteHotels.some((favHotel) => favHotel._id === hotel._id);

            // Sterne-Rendering (optional)
            function renderAverageStars(avg) {
                if (!avg || isNaN(avg)) return "";
                let starsHtml = "";
                for (let i = 1; i <= 5; i++) {
                    starsHtml += `<span style="color:${i <= Math.round(avg) ? "#FFD700" : "#ccc"
                        }">★</span>`;
                }
                return starsHtml;
            }

            const card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
        <div class="card hotel-card">
                  <div class="favorite-icon" style="position: absolute; top: 10px; right: 10px; z-index: 2;">
                    <i class="bi ${isFavorited ? "bi-heart-fill" : "bi-heart"
                }" data-hotel-id="${hotel._id
                }" style="font-size: 1.5rem; color: ${isFavorited ? "red" : "gray"
                }; cursor: pointer;"></i>
                  </div>
                  <img src="${hotel.image_url ||
                "https://source.unsplash.com/featured/?hotel"
                }" alt="Hotelbild">
                  <div class="hotel-info">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="hotel-name">${hotel.name}</div>
                        <div class="hotel-rating">${hotel.stars
                    ? "★".repeat(hotel.stars)
                    : "Keine Kategorie"
                }</div>
                    </div>
                    <div class="hotel-location">${hotel.location}</div>
                    <div class="hotel-price">ab ${hotel.price_per_night.toFixed(
                    2
                )} € / Nacht</div>
                    <div class="hotel-reviews">
                        <div class="average-stars">${renderAverageStars(
                    Number(averageRating)
                )}</div>
                        <div>${averageRating} / 5.0 von ${reviewCount} Bewertung(en)</div>
                    </div>
                  </div>
                </div>
      `;
            container.appendChild(card);
        });
        document.querySelectorAll(".favorite-icon").forEach((icon) => {
            icon.addEventListener("click", event => {
                const hotelId = event.target.getAttribute("data-hotel-id");
                toggleFavoriteHotel(hotelId, hotels);
            });
        });
        }
        document.getElementById('search-hotel-input').value = '';
    }
    catch (error) {
        container.innerHTML = `<p class="text-danger">Fehler beim Suchen von Hotel-Daten: ${error.message}</p>`;
    }
}

// Favoriten-Funktion (angepasst)
function toggleFavoriteHotel(hotelId, hotels) {
    let favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];
    const hotel = hotels.find(h => h._id === hotelId);

    if (favoriteHotels.some(favHotel => favHotel._id === hotelId)) {
        favoriteHotels = favoriteHotels.filter(favHotel => favHotel._id !== hotelId);
    } else if (hotel) {
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