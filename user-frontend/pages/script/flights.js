// Load, show and handle flights
async function loadFlights(sortOption = 'default') {
    const container = document.getElementById('flights-container');
    container.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/flights/get');
        if (!response.ok) throw new Error('Fehler beim Laden der Flugdaten');
        let flights = await response.json();

        // Sort flights based on the provided sort option
        switch (sortOption) {
            case 'price-asc':
                flights.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                flights.sort((a, b) => b.price - a.price);
                break;
            case 'default':
            default:
                break;
        }

        // Get existing favorites from localStorage
        const favoriteFlights = JSON.parse(localStorage.getItem('favoriteFlights')) || [];

        // Render flights
        if (flights.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Flüge gefunden</p>';
        } else {
            flights.forEach(flight => {
                const isFavorited = favoriteFlights.some(favFlight => favFlight._id === flight._id);

                const card = document.createElement('div');
                card.className = 'flight-card';

                let departureDate = flight.departure_time ? new Date(flight.departure_time) : null;
                let arrivalDate = flight.arrival_time ? new Date(flight.arrival_time) : null;
                let arrivalNextDay = arrivalDate && departureDate && arrivalDate.getDate() !== departureDate.getDate();

                card.innerHTML = `
                  <div class="flight-main">
                    <div class="flight-timeline">
                        <div class="flight-time">
                          ${flight.departure_time
                    ? new Date(flight.departure_time).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                    : '-'
                }<br />
                          <div class="flight-code">${flight.departure_airport || '-'}</div>
                        </div>
                        <div class="flight-line"></div>
                        <div class="flight-time">
                          ${arrivalNextDay ? '<small style="font-size: 0.7em">+1 Tag</small><br>' : ''}
                          ${flight.arrival_time
                    ? new Date(flight.arrival_time).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                    : '-'
                }<br />
                          <div class="flight-code">${flight.arrival_airport || '-'}</div>
                        </div>
                    </div>
                    <div class="flight-details">
                    <div><i class="bi bi-clock"></i>&nbsp;Dauer ${flight.departure_time && flight.arrival_time
                    ? Math.round((new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / (1000 * 60 * 60)) + 'h'
                    : '-'}</div>
                     <div style="display: flex; justify-content: space-between; margin-right: 10px;">
                        <div><i class="bi bi-airplane"></i>️&nbsp;Operated By ${flight.airline || '-'}&nbsp;&nbsp;${flight.flight_number}</div>
                        <div>
                            <i class="bi ${isFavorited ? 'bi-heart-fill' : 'bi-heart'}" 
                             data-flight-id="${flight._id}" 
                             style="font-size: 22px; color: ${isFavorited ? 'red' : 'gray'}; margin-left: 10px; cursor: pointer;"></i>
                        </div>
                    </div>
                    </div>
                  </div>
                  <div class="flight-separator"></div>

                  <div class="flight-price">
                    <small>from</small>
                    <div class="currency">EUR</div>
                    <strong>${flight.price ? flight.price.toFixed(2) : '-'}</strong>
                  </div>
                `;

                container.appendChild(card);
            });

            document.querySelectorAll('.flight-favorite i').forEach(icon => {
                icon.addEventListener('click', event => {
                    const flightId = event.target.getAttribute('data-flight-id');
                    toggleFavoriteFlight(flightId, flights);
                });
            });
        }
    } catch (error) {
        alert('Fehler: ' + error.message);
    }
}

// Toggle favorite flight
function toggleFavoriteFlight(flightId, flights) {
    let favoriteFlights = JSON.parse(localStorage.getItem('favoriteFlights')) || [];
    const flight = flights.find(h => h._id === flightId);

    if (favoriteFlights.some(favFlight => favFlight._id === flightId)) {
        favoriteFlights = favoriteFlights.filter(favFlight => favFlight._id !== flightId);
    } else {
        favoriteFlights.push(flight);
    }

    localStorage.setItem('favoriteFlights', JSON.stringify(favoriteFlights));

    renderFavoriteFlight();
    loadFlights();
}

function renderFavoriteFlight() {
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

document.getElementById('sort-option').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    loadFlights(selectedOption);
});
document.getElementById('search-button').addEventListener('click', async () => {
    const searchInput = document.getElementById('search-input').value.trim();

    if (!searchInput) {
        alert('Bitte geben Sie eine Stadt ein, um die Suche zu starten.');
        document.getElementById('search-input').value = '';
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/flights/find?city=${encodeURIComponent(searchInput)}`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Flugdaten.');

        const flightData = await response.json();

        const container = document.getElementById('flights-container');
        container.innerHTML = '';

        if (flightData.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Flüge gefunden</p>';
        } else {
            flightData.forEach(flight => {
                const card = document.createElement('div');
                card.className = 'flight-card';

                card.innerHTML = `
                  <div class="flight-main">
                    <div class="flight-timeline">
                      <div class="flight-time">
                        ${flight.departure_time
                    ? new Date(flight.departure_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })
                    : '-'
                }<br />
                        <div class="flight-code">${flight.departure_airport || '-'}</div>
                      </div>
                      <div class="flight-line"></div>
                      <div class="flight-time">
                        ${flight.arrival_time
                    ? new Date(flight.arrival_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })
                    : '-'
                }<br />
                        <div class="flight-code">${flight.arrival_airport || '-'}</div>
                      </div>
                    </div>
                    <div class="flight-details">
                      <div><i class="bi bi-clock"></i>&nbsp;Dauer ${flight.departure_time && flight.arrival_time
                    ? Math.round((new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / (1000 * 60 * 60)) + 'h'
                    : '-'
                }</div>
                      <div><i class="bi bi-airplane"></i>️&nbsp;Operated By ${flight.airline || '-'}&nbsp;&nbsp;${flight.flight_number}</div>
                    </div>
                  </div>
                  
                  <div class="flight-separator"></div>

                  <div class="flight-price">
                    <small>from</small>
                    <div class="currency">EUR</div>
                    <strong>${flight.price ? flight.price.toFixed(2) : '-'}</strong>
                  </div>`;
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error(error);
        alert('Es ist ein Fehler aufgetreten: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadFlights();
    renderFavoriteFlight();
});