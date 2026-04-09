let weatherData;

/**
 * Utility function to get the coordinates of a city using the Open-Meteo Geocoding API
 * @param {String} city 
 * @returns an object containing the latitude and longitude of the city
 */
export const getCoordinates = async(city) => {
      const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    const data = await res.json();
    return data.results[0];   //latitude and longitude of the city
}

/**
 * Get the weather data for the city at the given latitude and longitude coordinates:
 *     function add api path and parameters to fetch the weather data from the Open-Meteo API
 * Base api path: https://api.open-meteo.com/v1/forecast
 * Parameters:
 *     latitude
 *     longitude
 *     timezone=auto: determines the timezone based on the coordinates
 *     hourly: temperature_2m,relative_humidity_2m,precipitation_probability,rain,Snowfall,Snow_depth,Cloudcover,windspeed_10m
 *     daily: temperature_2m_max,temperature_2m_min
 *@param {Number} latitude
 *@param {Number} longitude
 *@returns an object containing the weather data for the city
 */

export async function getWeatherApi(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,windspeed_10m,cloudcover,snowfall,weathercode`;
    const res = await fetch(url);
    return await res.json();
}

