async function loadCars(sortOption = 'default') {
    const container = document.getElementById('car-container');
    container.innerHTML = '';

    try {
        // 1. Mietautos laden
        const carsRes = await fetch('http://localhost:3002/cars/get');
        if (!carsRes.ok) {
            throw new Error(`Fehler beim Laden der Daten: ${carsRes.status}`);
        }
        const cars = await carsRes.json();

        // 2. Für jedes Auto die Durchschnittsbewertung laden
        const reviewPromises = cars.map(car =>
            fetch(`http://localhost:3003/reviews/getaverage/rentalcar/${car._id}`)
        );
        const reviewResponses = await Promise.all(reviewPromises);
        const reviews = await Promise.all(reviewResponses.map(res => res.json()));

        // 3. Map mit Car-ID als Schüssel bauen
        const reviewMap = {};
        cars.forEach((car, idx) => {
            reviewMap[car._id] = {
                average: reviews[idx].average,
                count: reviews[idx].count
            };
        });

        // 4. Favoriten laden
        const favoriteCars = JSON.parse(localStorage.getItem('favoriteCars')) || [];

        // 5. Sortierung der Autos
        switch (sortOption) {
            case 'price-asc':
                cars.sort((a, b) => a.daily_rate - b.daily_rate);
                break;
            case 'price-desc':
                cars.sort((a, b) => b.daily_rate - a.daily_rate);
                break;
            case 'ps-asc':
                cars.sort((a, b) => a.power - b.power);
                break;
            case 'ps-desc':
                cars.sort((a, b) => b.power - a.power);
                break;
            case 'default':
            default:
                break;
        }
        // 6. Autos rendern
        if (cars.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Autos gefunden</p>';
        } else {
            cars.forEach(car => {
                const averageRating =
                reviewMap[car._id]?.average !== null &&
                    reviewMap[car._id]?.average !== undefined
                    ? reviewMap[car._id].average
                    : "Keine Bewertungen";
                const reviewCount = reviewMap[car._id]?.count || 0;

                const isFavorited = favoriteCars.some(favCars => favCars._id === car._id);

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

                const card = document.createElement('div');

                card.className = 'col-md-4';

                card.innerHTML = `
                  <div class="card car-card">
                  <div class="favorite-icon" style="position: absolute; top: 10px; right: 10px; z-index: 2;">
                    <i class="bi ${isFavorited ? 'bi-heart-fill' : 'bi-heart'}" data-car-id="${car._id}" style="font-size: 1.5rem; color: ${isFavorited ? 'red' : 'gray'}; cursor: pointer;"></i>
                  </div>
                    <img src="${car.imageUrl}" alt="${car.brand} ${car.model}">
                    <div class="car-info">
                        <div class="car-name">${car.brand} ${car.model}</div>
                        <div class="car-location">Berlin, Deutschland</div>
                        <div class="car-price">ab ${car.daily_rate.toFixed(2)} € / Tag</div>
                        <div class="car-details text-muted small mt-2">
                            <div><strong>Leistung:</strong> ${car.power}&nbsp;PS</div>
                            <div><strong>Baujahr:</strong> ${car.year}</div>
                            <div><strong>Kraftstoff:</strong> ${car.fuel_type}</div>
                            <div>${car.class}</div>
                        </div>
                        <div class="car-status mt-2">
                            <span class="badge ${car.is_available ? 'bg-success' : 'bg-danger'}">
                            ${car.is_available ? 'Verfügbar' : 'Belegt bis: ' + new Date(car.occupied_until).toLocaleDateString('de-DE')}
                            </span>
                        </div>
                        <div class="hotel-reviews">
                            <div class="average-stars">${renderAverageStars(
                                Number(averageRating)
                                )}
                            </div>
                            <div>${averageRating} / 5.0 von ${reviewCount} Bewertung(en)</div>
                        </div>
                    </div>
                  </div>
                `;

                container.appendChild(card);
            });

            document.querySelectorAll('.favorite-icon i').forEach(icon => {
                icon.addEventListener('click', event => {
                    const carId = event.target.getAttribute('data-car-id');
                    toggleFavoriteCar(carId, cars);
                });
            });
        }
    } catch (error) {
        console.error('Fehler:', error);
        container.innerHTML = `<p class="text-danger">Fehler beim Laden der Autodaten: ${error.message}</p>`;
    }
}
async function searchCars(query) {
    // 1. Mietautos laden
    const carsRes = await fetch('http://localhost:3002/cars/get');
    if (!carsRes.ok) {
        throw new Error(`Fehler beim Laden der Daten: ${carsRes.status}`);
    }
    const cars = await carsRes.json();

    // 2. Für jedes Auto die Durchschnittsbewertung laden
    const reviewPromises = cars.map(car =>
        fetch(`http://localhost:3003/reviews/getaverage/rentalcar/${car._id}`)
    );
    const reviewResponses = await Promise.all(reviewPromises);
    const reviews = await Promise.all(reviewResponses.map(res => res.json()));

    // 3. Map mit Car-ID als Schüssel bauen
    const reviewMap = {};
    cars.forEach((car, idx) => {
        reviewMap[car._id] = {
            average: reviews[idx].average,
            count: reviews[idx].count
        };
    });
    const container = document.getElementById('car-container');
    container.innerHTML = '';

    if (!query || query.trim() === '') {
        alert('Bitte geben Sie einen Suchbegriff ein.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3002/cars/find?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Fehler beim Suchen der Autodaten');
        const cars = await response.json();

        if (cars.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Autos gefunden</p>';
        } else {
            cars.forEach(car => {
                const averageRating =
                reviewMap[car._id]?.average !== null &&
                    reviewMap[car._id]?.average !== undefined
                    ? reviewMap[car._id].average
                    : "Keine Bewertungen";
                const reviewCount = reviewMap[car._id]?.count || 0;


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

                const card = document.createElement('div');
                card.className = 'col-md-4';

                card.innerHTML = `
                  <div class="card car-card">
                    <img src="${car.imageUrl}" alt="${car.brand} ${car.model}">
                    <div class="car-info">
                      <div class="car-name">${car.brand} ${car.model}</div>
                      <div class="car-location">Berlin, Deutschland</div>
                      <div class="car-price">ab ${car.daily_rate.toFixed(2)} € / Tag</div>
                      <div class="car-details text-muted small mt-2">
                        <div><strong>Leistung:</strong> ${car.power}&nbsp;PS</div>
                        <div><strong>Baujahr:</strong> ${car.year}</div>
                        <div><strong>Kraftstoff:</strong> ${car.fuel_type}</div>
                        <div>${car.class}</div>
                      </div>
                      <div class="car-status mt-2">
                        <span class="badge ${car.is_available ? 'bg-success' : 'bg-danger'}">
                          ${car.is_available ? 'Verfügbar' : 'Belegt bis: ' + new Date(car.occupied_until).toLocaleDateString()}
                        </span>
                      </div>
                      <div class="hotel-reviews">
                            <div class="average-stars">${renderAverageStars(
                                Number(averageRating)
                                )}
                            </div>
                            <div>${averageRating} / 5.0 von ${reviewCount} Bewertung(en)</div>
                        </div>
                    </div>
                  </div>
                `;

                container.appendChild(card);
            });
        }
        document.getElementById('search-car-input').value = '';
    } catch (error) {
        console.error('Fehler:', error);
        container.innerHTML = `<p class="text-danger">Fehler beim Suchen der Autodaten: ${error.message}</p>`;
    }
}

function toggleFavoriteCar(carId, cars) {
    let favoriteCars = JSON.parse(localStorage.getItem('favoriteCars')) || [];
    const car = cars.find(c => c._id === carId);

    if (favoriteCars.some(favCar => favCar._id === carId)) {
        favoriteCars = favoriteCars.filter(favCar => favCar._id !== carId);
    } else {
        favoriteCars.push(car);
    }

    localStorage.setItem('favoriteCars', JSON.stringify(favoriteCars));

    renderFavoriteCars();
    loadCars();
}
function renderFavoriteCars() {
    const favCarContainer = document.getElementById('fav-cars');
    if (!favCarContainer) return;

    const favoriteCars = JSON.parse(localStorage.getItem('favoriteCars')) || [];
    favCarContainer.innerHTML = '';

    if (favoriteCars.length === 0) {
        favCarContainer.innerHTML = '<p class="text-muted">Keine favorisierten Autos gefunden.</p>';
        return;
    }

    favoriteCars.forEach(car => {
        const favCarItem = document.createElement('li');
        favCarItem.className = 'list-group-item';
        favCarItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${car.name} - ${car.location}</span>
                <i class="bi bi-trash" style="cursor: pointer;" data-car-id="${car._id}"></i>
            </div>
        `;

        favCarItem.querySelector('.bi-trash').addEventListener('click', () => {
            toggleFavoriteCar(car._id, []);
        });

        favCarContainer.appendChild(favCarItem);
    });
}

document.getElementById('sort-car-option').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    loadCars(selectedOption);
});
document.getElementById('search-car-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-car-input').value.trim();
    searchCars(searchInput);
});

// on-load functions
document.addEventListener('DOMContentLoaded', () => {
    loadCars();
    renderFavoriteCars();
});