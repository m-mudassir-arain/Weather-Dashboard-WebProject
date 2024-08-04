const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.querySelector('#locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const forecastContainer = document.querySelector('.forecast-container');

let cityInput = 'London';
const apikey = 'ca55d665df874623874150741240108';

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.textContent;
        fetchWeatherData();
        app.style.opacity = "1";
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (search.value.trim() === "") {
        alert('Please enter the city name');
    } else {
        cityInput = search.value.trim();
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "1";
    }
});

function daysOfTheWeek(day, month, year) {
    const date = new Date(year, month - 1, day);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function fetchWeatherData() {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${cityInput}&days=5&aqi=no&alerts=no`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            // Current weather
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.textContent = data.current.condition.text;

            const dateStr = data.location.localtime;
            const y = parseInt(dateStr.substr(0, 4));
            const m = parseInt(dateStr.substr(5, 2));
            const d = parseInt(dateStr.substr(8, 2));
            const time = dateStr.substr(11);

            const dayName = daysOfTheWeek(d, m, y);

            dateOutput.textContent = `${dayName}, ${d}-${m}-${y}`;
            timeOutput.textContent = time;
            nameOutput.textContent = data.location.name;

            cloudOutput.textContent = data.current.cloud + "%";
            humidityOutput.textContent = data.current.humidity + "%";
            windOutput.textContent = data.current.wind_kph + " km/h";

            const timeOfDay = data.current.is_day ? 'day' : 'night';
            const code = data.current.condition.code;
            const iconUrl = data.current.condition.icon;
            icon.src = iconUrl;

            const backgrounds = {
                clear: `url(images/${timeOfDay}/clear.jpg)`,
                cloudy: `url(images/${timeOfDay}/clouds.jpg)`,
                rain: `url(images/${timeOfDay}/rain.jpg)`,
                snow: `url(images/${timeOfDay}/snow.jpg)`
            };

            const cloudyCodes = [1003, 1006, 1009];
            const rainyCodes = [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1192, 1195, 1204, 1207, 1240, 1243, 1246];
            const snowyCodes = [1066, 1168, 1171, 1198, 1201];

            if (cloudyCodes.includes(code)) {
                app.style.backgroundImage = backgrounds.cloudy;
                btn.style.background = "#fa6d1b";
            } else if (rainyCodes.includes(code)) {
                app.style.backgroundImage = backgrounds.rain;
                btn.style.background = "#647d75";
            } else if (snowyCodes.includes(code)) {
                app.style.backgroundImage = backgrounds.snow;
                btn.style.background = "#4d72aa";
            } else {
                app.style.backgroundImage = backgrounds.clear;
                btn.style.background = "#fa6d1b";
            }

            if (timeOfDay === "night") {
                btn.style.background = '#181e27';
            }

            // Forecast weather
            forecastContainer.innerHTML = '<h4>Weather Forecast</h4>'; // Clear any previous forecast data
            data.forecast.forecastday.forEach(day => {
                const forecastDate = new Date(day.date);
                const forecastDayName = daysOfTheWeek(forecastDate.getDate(), forecastDate.getMonth() + 1, forecastDate.getFullYear());

                const forecastHTML = `
                    <div class="forecast">
                        <div class="forecast-date">${forecastDayName}</div>
                        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon">
                        <div class="forecast-temp">${day.day.avgtemp_c}&#176;C</div>
                        <div class="forecast-condition">${day.day.condition.text}</div>
                    </div>
                `;
                forecastContainer.insertAdjacentHTML('beforeend', forecastHTML);
            });

            app.style.opacity = "1";
        })
        .catch((error) => {
            alert(error.message);
            app.style.opacity = "1";
        });
}

// Initial fetch
fetchWeatherData();
