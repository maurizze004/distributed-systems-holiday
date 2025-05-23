// load, show and filter flights
async function loadFlights(sortOption = 'default') {
    const container = document.getElementById('flights-container');
    container.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/flights/get');
        if (!response.ok) throw new Error('Fehler beim Laden der Flugdaten');
        let flights = await response.json();

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

        if (flights.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Flüge gefunden</p>';
        } else {
            flights.forEach(flight => {
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
                        <div><i class="bi bi-clock"></i>&nbsp;Dauer ${flight.departure_time && flight.arrival_time ? Math.round((new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / (1000 * 60 * 60)) + 'h' : '-'}</div>
                        <div><i class="bi bi-airplane"></i>️&nbsp;Operated By ${flight.airline || '-'}&nbsp;&nbsp;${flight.flight_number}</div>
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
        }
    } catch (error) {
        alert('Fehler: ' + error.message);
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

        const container = document.getElementById('flights-container'); // Container für Flugdaten
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
                document.getElementById('search-input').value = '';
            });
        }
    } catch (error) {
        console.error(error);
        alert('Es ist ein Fehler aufgetreten: ' + error.message);
    }
});

// on-load functions
loadFlights();