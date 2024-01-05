const apiKey = '6803ba5d09b802dc0683b6404c691e4e';

function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;

    if (cityInput.trim() === '') {
        alert('Please enter a city.');
        return;
    }

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=metric`;

    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            initMap(data.coord.lat, data.coord.lon, data.name, data.main.temp, data.weather[0].description);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('City not found or an error occurred. Please try again.');
        });

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather forecast data:', error);
        });

    const searchButton = document.getElementById('searchButton');
    searchButton.textContent = 'Search Another City';
    searchButton.setAttribute('onclick', 'searchAnotherCity()');
}

function searchAnotherCity() {
    location.reload();
}

function displayCurrentWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    const weatherHtml = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature} ℃</p>
        <p>Description: ${description}</p>
    `;

    document.getElementById('weatherInfo').innerHTML = weatherHtml;
}

function displayWeatherForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; 

    const table = document.createElement('table');
    table.classList.add('forecast-table');

    const headerRow = table.insertRow(0);
    const headerDateCell = headerRow.insertCell(0);
    const headerTemperatureCell = headerRow.insertCell(1);
    const headerDescriptionCell = headerRow.insertCell(2);
    headerDateCell.textContent = 'Date';
    headerTemperatureCell.textContent = 'Temperature (℃)';
    headerDescriptionCell.textContent = 'Description';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];
        const date = new Date(forecastItem.dt * 1000);
        const temperature = forecastItem.main.temp;
        const description = forecastItem.weather[0].description;

        const row = table.insertRow(-1);
        const dateCell = row.insertCell(0);
        const temperatureCell = row.insertCell(1);
        const descriptionCell = row.insertCell(2);

        dateCell.textContent = date.toDateString();
        temperatureCell.textContent = temperature.toFixed(2); 
        descriptionCell.textContent = description;
    }

    forecastContainer.appendChild(table);
}

function initMap(lat, lon, cityName, temperature, description) {
    const map = L.map('map').setView([lat, lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    const popupContent = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature} ℃</p>
        <p>Description: ${description}</p>
    `;
    marker.bindPopup(popupContent).openPopup();
}
