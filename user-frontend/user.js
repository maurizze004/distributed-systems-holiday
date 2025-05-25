// Favorite Hotels
function renderFavoriteHotels() {
    const favHotelsContainer = document.getElementById('fav-hotels');
    const favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];
    favHotelsContainer.innerHTML = '';
    if (!favoriteHotels.length) {
        favHotelsContainer.innerHTML = '<p class="text-muted">Keine favorisierten Hotels gefunden.</p>';
    } else {
        favoriteHotels.forEach(hotel => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.style.marginBottom = '20px';
            listItem.style.borderRadius = '10px';
            listItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${hotel.name} ${hotel.stars ? '★'.repeat(hotel.stars) : ''} <br> ${hotel.location} <br> ${hotel.price_per_night}&nbsp;&euro; / Nacht</span>
                    <i class="bi bi-trash text-danger" style="cursor: pointer;" data-hotel-id="${hotel._id}"></i>
                </div>
            `;
            listItem.querySelector('.bi-trash').addEventListener('click', () => {
                removeFavoriteHotel(hotel._id);
            });
            favHotelsContainer.appendChild(listItem);
        });
    }
}
function removeFavoriteHotel(hotelId) {
    let favoriteHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];
    favoriteHotels = favoriteHotels.filter(hotel => hotel._id !== hotelId);
    localStorage.setItem('favoriteHotels', JSON.stringify(favoriteHotels));
    renderFavoriteHotels();
}

// Favorite Flights
function renderFavoriteFlights() {
    const favFlightsContainer = document.getElementById('fav-flights');
    const favoriteFlights = JSON.parse(localStorage.getItem('favoriteFlights')) || [];
    favFlightsContainer.innerHTML = '';
    if (!favoriteFlights.length) {
        favFlightsContainer.innerHTML = '<p class="text-muted">Keine favorisierten Flüge gefunden.</p>';
    } else {
        favoriteFlights.forEach(flight => {
            const listItem = document.createElement('li');
            const departureTime = new Date(flight.departure_time).toLocaleString('de-DE');
            listItem.className = 'list-group-item';
            listItem.style.marginBottom = '20px';
            listItem.style.borderRadius = '10px';
            listItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${flight.departure_airport} → ${flight.arrival_airport} <br>${departureTime} <br> ${flight.price}&nbsp;&euro;</span>
                    <i class="bi bi-trash text-danger" style="cursor: pointer;" data-flight-id="${flight._id}"></i>
                </div>
            `;
            listItem.querySelector('.bi-trash').addEventListener('click', () => {
                removeFavoriteFlight(flight._id);
            });
            favFlightsContainer.appendChild(listItem);
        });
    }
}
function removeFavoriteFlight(flightId) {
    let favoriteFlights = JSON.parse(localStorage.getItem('favoriteFlights')) || [];
    favoriteFlights = favoriteFlights.filter(flight => flight._id !== flightId);
    localStorage.setItem('favoriteFlights', JSON.stringify(favoriteFlights));
    renderFavoriteFlights();
}

// Favorite Cars
function renderFavoriteCars() {
    const favCarContainer = document.getElementById('fav-cars');
    const favoriteCars = JSON.parse(localStorage.getItem('favoriteCars')) || [];
    favCarContainer.innerHTML = '';
    if (!favoriteCars.length) {
        favCarContainer.innerHTML = '<p class="text-muted">Keine favorisierten Autos gefunden.</p>';
    } else {
        favoriteCars.forEach(car => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.style.marginBottom = '20px';
            listItem.style.borderRadius = '10px';
            listItem.innerHTML = `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span>${car.brand} ${car.model}<br></span>
                        <span>${car.power}&nbsp;PS / ${car.class}<br></span>
                        <span>${car.daily_rate}&nbsp;&euro; / Tag</span>
                    </div>
                    <i class="bi bi-trash text-danger" style="cursor: pointer;" data-car-id="${car._id}"></i>
                  </div>
            `;
            listItem.querySelector('.bi-trash').addEventListener('click', () => {
                removeFavoriteCar(car._id);
            });
            favCarContainer.appendChild(listItem);
        });
    }
}
function removeFavoriteCar(carId) {
    let favoriteCars = JSON.parse(localStorage.getItem('favoriteCars')) || [];
    favoriteCars = favoriteCars.filter(car => car._id !== carId);
    localStorage.setItem('favoriteCars', JSON.stringify(favoriteCars));
    renderFavoriteCars();
}

// Render Favorites
document.addEventListener('DOMContentLoaded', () => {
    renderFavoriteHotels();
    renderFavoriteFlights();
    renderFavoriteCars();
});