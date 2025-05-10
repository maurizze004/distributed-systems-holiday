async function loadHotels(sortOption = 'default') {
    const container = document.getElementById('hotel-container');
    container.innerHTML = '';
    document.getElementById('search-hotel-input').value = '';

    try {
        const response = await fetch('http://localhost:3001/hotels/get');
        if (!response.ok) throw new Error('Fehler beim Laden der Hoteldaten');
        let hotels = await response.json();

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

        if (hotels.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Hotels gefunden</p>';
        } else {
            hotels.forEach(hotel => {
                const col = document.createElement('div');
                col.className = 'col-md-4';
                col.innerHTML = `
                <div class="card hotel-card">
                  <img src="${hotel.image_url || 'https://source.unsplash.com/featured/?hotel'}" alt="Hotelbild">
                  <div class="hotel-info">
                    <div class="hotel-name">${hotel.name}</div>
                    <div class="hotel-location">${hotel.location}</div>
                    <div class="hotel-price">ab ${hotel.price_per_night.toFixed(2)} € / Nacht</div>
                    <div class="hotel-rating">${hotel.stars ? '★'.repeat(hotel.stars) : 'Keine Bewertung'}&nbsp;(${hotel.stars || 0}.0)</div>
                  </div>
                </div>`;
                container.appendChild(col);
            });
        }
    } catch (error) {
        console.error('Fehler:', error);
        container.innerHTML = `<p class="text-danger">Fehler: ${error.message}</p>`;
    }
}

async function searchHotels(query) {
    const container = document.getElementById('hotel-container');
    container.innerHTML = '';

    if (!query || query.trim() === '') {
        alert('Bitte geben Sie einen Suchbegriff ein.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/hotels/find?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Fehler beim Suchen der Hoteldaten');
        const hotels = await response.json();

        if (hotels.length === 0) {
            container.innerHTML = '<p class="text-center">Keine Hotels gefunden</p>';
        } else {
            hotels.forEach(hotel => {
                const col = document.createElement('div');
                col.className = 'col-md-4';
                col.innerHTML = `
                <div class="card hotel-card">
                  <img src="${hotel.image_url || 'https://source.unsplash.com/featured/?hotel'}" alt="Hotelbild">
                  <div class="hotel-info">
                    <div class="hotel-name">${hotel.name}</div>
                    <div class="hotel-location">${hotel.location}</div>
                    <div class="hotel-price">ab ${hotel.price_per_night.toFixed(2)} € / Nacht</div>
                    <div class="hotel-rating">${hotel.stars ? '★'.repeat(hotel.stars) : 'Keine Bewertung'}&nbsp;(${hotel.stars || 0}.0)</div>
                  </div>
                </div>`;
                container.appendChild(col);
            });
        }
        document.getElementById('search-hotel-input').value = '';
    } catch (error) {
        console.error('Fehler:', error);
        container.innerHTML = `<p class="text-danger">Es ist ein Fehler aufgetreten: ${error.message}</p>`;
    }
}

document.getElementById('sort-hotel-option').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    loadHotels(selectedOption);
});

document.getElementById('search-hotel-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-hotel-input').value.trim();
    searchHotels(searchInput);
});

loadHotels();