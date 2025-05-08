// load, show and filter flights
async function loadFlights(sortOption = 'default') {
    const container = document.getElementById('flights-container'); // Container mit korrekter ID ansprechen
    container.innerHTML = ''; // Container leeren

    try {
        const response = await fetch('http://localhost:3000/flights/get'); // Daten abrufen
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
                        <div>🕑&nbsp;Dauer ${flight.departure_time && flight.arrival_time ? Math.round((new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / (1000 * 60 * 60)) + 'h' : '-'}</div>
                        <div>✈️&nbsp;Operated By ${flight.airline || '-'}&nbsp;&nbsp;${flight.flight_number}</div>
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
    const selectedOption = event.target.value; // Gewählte Sortieroption
    loadFlights(selectedOption); // Flüge basierend auf der Auswahl neu laden
});


// on-load functions
loadFlights();