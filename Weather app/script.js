function getWeather() {
    const city = document.getElementById('city').value;
    const weatherInfo = document.getElementById('weather-info');
    const temp = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const description = document.getElementById('description');

    async function getData(city) {
        const promise = await fetch(`http://api.weatherapi.com/v1/current.json?key=74027e5c71c34405b8c150953250508&q=${city}&aqi=yes`);
        console.log(promise);
        return await promise.json();
    }
    async function getForecast(city) {
        const promise = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=74027e5c71c34405b8c150953250508&q=${city}&days=5`);
        console.log(promise);
        return await promise.json();
    }
        getData(city).then((data) => {
        temp.textContent = data.current.temp_c + ' °C';
        humidity.textContent = data.current.humidity + ' %';
        description.textContent = data.current.condition.text;
        weatherInfo.style.display = 'block';
    }).catch((error) => {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
    });
    getForecast(city).then((data) => {
        const forecastInfo = document.getElementById('forecast-info');
        forecastInfo.innerHTML = '';
        data.forecast.forecastday.forEach((day) => {
            const dayInfo = document.createElement('div');
            dayInfo.innerHTML = `
                <p><strong>${day.date}</strong></p>
                <p>Temp: ${day.day.avgtemp_c} °C</p>
                <p>Humidity: ${day.day.avghumidity} %</p>
                <p>Description: ${day.day.condition.text}</p>
            `;
            forecastInfo.appendChild(dayInfo);
        });
    }).catch((error) => {
        console.error('Error fetching forecast data:', error);
        alert('Failed to fetch forecast data. Please try again later.');
    });
}