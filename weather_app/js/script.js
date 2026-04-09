// script.js

import { getCoordinates, getWeatherApi } from "./api.js";
import { updateUI, generateHourlyCards } from "./ui.js";
import { generateChart } from "./chart.js";

let weatherData;

/**
 * Get the weather data for a city by first getting its coordinates and then fetching the weather data using those coordinates
 * @param {Sting} city 
 */
async function getLocationWeather(city) {
    try {
        const geo = await getCoordinates(city);

        if (!geo) {
            alert("City not found");
            return;
        }

        const { latitude, longitude, name } = geo;

        weatherData = await getWeatherApi(latitude, longitude);

        updateUI(weatherData, name);
        generateHourlyCards(weatherData);

        generateChart(
            weatherData.hourly.time.slice(0, 24),
            weatherData.hourly.temperature_2m.slice(0, 24),
            "Temperature"
        );

    } catch (error) {
        console.error(error);
    }
}


// Input bar event
 
document.getElementById("locationInp")
.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        await getLocationWeather(e.target.value);
    }
});

//icon slider event

const slider = document.getElementById("weeklyCards");
const left = document.getElementById("arrowLeft");
const right = document.getElementById("arrowRight");

right.addEventListener("click", () => {
    slider.scrollBy({ left: 300, behavior: "smooth" });
});

left.addEventListener("click", () => {
    slider.scrollBy({ left: -300, behavior: "smooth" });
});


// buttons event
 
const buttons = document.querySelectorAll(".tab-btn");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (!weatherData) return;

        const type = btn.dataset.type;
        const labels = weatherData.hourly.time.slice(0, 24).map(t => new Date(t).getHours() + ":00");;

        buttons.forEach(b =>
            b.classList.remove("bg-blue-500", "text-white")
        );

        btn.classList.add("bg-blue-500", "text-white");

        switch (type) {
            case "temp":
                generateChart(labels,
                    weatherData.hourly.temperature_2m.slice(0, 24),
                    "Temperature");
                break;

            case "humidity":
                generateChart(labels,
                    weatherData.hourly.relative_humidity_2m.slice(0, 24),
                    "Humidity");
                break;

            case "rain":
                generateChart(labels,
                    weatherData.hourly.precipitation_probability.slice(0, 24),
                    "Rain");
                break;
        }

        btn.classList.add("bg-blue-500", "text-white");
    });
});