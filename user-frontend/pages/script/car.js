async function loadCars(sortOption = 'default') {
    const container = document.getElementById('car-container');
    container.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3002/cars/get');
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Daten: ${response.status}`);
        }
        const cars = await response.json();

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

        if (cars.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Autos gefunden</p>';
        } else {
            cars.forEach(car => {
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
                    </div>
                  </div>
                `;

                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Fehler:', error);
        container.innerHTML = `<p class="text-danger">Fehler beim Laden der Autodaten: ${error.message}</p>`;
    }
}

async function searchCars(query) {
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

document.getElementById('sort-car-option').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    loadCars(selectedOption);
});
document.getElementById('search-car-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-car-input').value.trim();
    searchCars(searchInput);
});

// on-load functions
loadCars();