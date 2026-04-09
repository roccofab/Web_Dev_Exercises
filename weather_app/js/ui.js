

/**
 *  Updates the UI with the current weather data and city name
 * @param {Object} weatherData 
 * @param {String} cityName 
 */
export function updateUI(weatherData, cityName) {
    document.getElementById("cityTitle").textContent =
        `Meteo in ${cityName}`;

    document.getElementById("temperature").textContent =
        weatherData.current_weather.temperature + "°C";

    document.getElementById("humidity").textContent =
        weatherData.hourly.relative_humidity_2m[0] + "%";

    document.getElementById("rain").textContent =
        weatherData.hourly.rain[0] + " mm";

    document.getElementById("rainProbability").textContent =
        weatherData.hourly.precipitation_probability[0] + "%";

    document.getElementById("wind").textContent =
        weatherData.current_weather.windspeed + " km/h";

    setWeatherIcon(weatherData);
}

/**
 * Determines the weather condition based on the weather code:
 *    the Open-Meteo API privides a weather code 
 *    that represents the current weather condition (clear, cloudy, fog, drizzle, rain, snow, shower, thunderstorm)
 * @param {Number} code 
 * @returns {String} weather condition (clear, cloudy, fog, drizzle, rain, snow, shower, thunderstorm)
 */
function getWeatherCondition(code){
    if(code === 0) return "clear";
    if(code === 1 || code === 2 || code === 3) return "cloudy";
    if(code === 45 || code === 48) return "fog";
    if(code === 51 || code === 53 || code === 55) return "drizzle";
    if(code === 61 || code === 63 || code === 65) return "rain";
    if(code === 71 || code === 73 || code === 75) return "snow";
    if(code === 80 || code === 81 || code === 82) return "shower";
    if(code === 95 || code === 96 || code === 99) return "thunderstorm";
}

/**
 * Utility function to generate the correct weather icon based
 *    on the weather code and the time of day (day or night)
 * @param {Object} weatherData 
 */
function setWeatherIcon(weatherData){
    const code = weatherData.current_weather.weathercode;
    const cond = getWeatherCondition(code);
    const isDay = weatherData.current_weather.is_day;
    const windSpeed = weatherData.current_weather.windspeed;

    const icon = document.getElementById("conditionIcon");
    let iconPath="";

    switch(cond){
        case "clear":
            iconPath = isDay ? "icons/sun.png" : "icons/moon_clear.png";
            break;

        case "cloudy":
            iconPath = isDay ? "icons/cloudy.png" : "icons/moon_cloudy.png";
            break;

        case "fog":
            iconPath = isDay ? "icons/fog.png" : "icons/moon_fog.png";
            break;

        case "drizzle":
            iconPath = isDay ? "icons/drizzle.png" : "icons/drizzle-night.png";
            break;

        case "rain":
            iconPath = isDay ? "icons/heavy_rain.png" : "icons/heavy_rain_moon.png";
            break;

        case "thunderstorm":
            iconPath = isDay ? "icons/thunderstorm.png" : "icons/thunderstorm_moon.png";
            break;

        case "snow":
            iconPath = isDay ? "icons/snow.png" : "icons/snow_moon.png";
            break;

        default:
            iconPath = "icons/cloudy.png";
    }

    if (windSpeed > 35) 
        iconPath = "icons/storm.png";
    
    icon.innerHTML = `<img src="${iconPath}" style="width:60px; height:60px;">`;
}

function setHourlyIcon(code,isDay,windSpeed){
    const cond = getWeatherCondition(code);
    let iconPath="";

    switch(cond){
        case "clear":
            iconPath = isDay ? "icons/sun.png" : "icons/moon_clear.png";
            break;

        case "cloudy":
            iconPath = isDay ? "icons/cloudy.png" : "icons/moon_cloudy.png";
            break;

        case "fog":
            iconPath = isDay ? "icons/fog.png" : "icons/moon_fog.png";
            break;

        case "drizzle":
            iconPath = isDay ? "icons/drizzle.png" : "icons/drizzle-night.png";
            break;

        case "rain":
            iconPath = isDay ? "icons/heavy_rain.png" : "icons/heavy_rain_moon.png";
            break;

        case "thunderstorm":
            iconPath = isDay ? "icons/thunderstorm.png" : "icons/thunderstorm_moon.png";
            break;

        case "snow":
            iconPath = isDay ? "icons/snow.png" : "icons/snow_moon.png";
            break;

        default:
            iconPath = "icons/cloudy.png";
    }

     if (windSpeed > 35) {
        iconPath = "icons/storm.png";
    }
    return iconPath;
}

export function generateHourlyCards(weatherData){
    const container = document.getElementById("weeklyCards");

    // reset
    container.innerHTML = "";

    const times = weatherData.hourly.time.slice(0, 24);
    const temps = weatherData.hourly.temperature_2m.slice(0, 24);
    const codes = weatherData.hourly.weathercode.slice(0, 24);
    const winds = weatherData.hourly.windspeed_10m.slice(0, 24);

    times.forEach((time, i) => {
        const hour = new Date(time).getHours(); // extract hour from time string
        const isDay = hour >= 6 && hour < 20;  //daytime between 6:00 and 20:00

        const iconPath = setHourlyIcon(codes[i], isDay, winds[i]); // get the correct icon path based on weather code, time of day and wind speed

        //create cards
        const card = document.createElement("div");
        card.className = "hourlyCard";
        card.innerHTML = `
            <p class="text-sm">${hour}:00</p>
            <img src="${iconPath}" style="width:40px;height:40px;">
            <p class="font-bold">${temps[i]}°C</p>
            `;

        container.appendChild(card);
    });
}