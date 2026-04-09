let chart;
let weatherData;

import { getCoordinates, getWeatherApi } from "./api.js";


/**
 *  Generates a chart with the given parameter, data and label.
 * @param {String} parameter 
 * @param {Number} data 
 * @param {String} label 
 */
export function generateChart(labels, vals, label){
    const c = document.getElementById("chart");

    // destroy the previous chart before creating a new one 
    
    if (chart) 
        chart.destroy(); 

        chart = new Chart(c, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: vals
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        display: false // hide x-axis labels
                    }
                }
            }
        }
    });
}

