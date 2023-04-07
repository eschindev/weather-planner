var API_KEY = "b435488a41da2efd3cc26695a12e36f3";

var citySearchBtn = $('#city-search-button');
var citySearchBox = $('#city-search-box');
var currentDayOutput = $('#current-day-output');
var fiveDayHeader = $('#five-day-header');
var fiveDayForecast = $('#five-day-forecast');



function getCoords(city) {
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("getCoords");
            console.log(data);
            getCurrent(data[0].lat, data[0].lon);
            getFiveDay(data[0].lat, data[0].lon);
        })
}

function getCurrent(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("getCurrent")
            console.log(data);

            var currentDayHeader = $("<h2>").text(`${data.name} on ${dayjs().format("M/D/YYYY")}`);
            currentDayOutput.append(currentDayHeader);

            var currentDayList = $("<ul>")
            var currentTemp = $("<li>").html(`Temp: ${data.main.temp}&deg;F`);
            var currentWind = $("<li>").text(`Wind: ${data.wind.speed}mph`);
            var currentHum = $("<li>").text(`Humidity: ${data.main.humidity}%`);
            currentDayList.append(currentTemp);
            currentDayList.append(currentWind);
            currentDayList.append(currentHum);
            currentDayOutput.append(currentDayList);
        })
}

function getFiveDay(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("getFiveDay");
            console.log(data);
            //generate 5-day forecast header
            var fdh = $("<h2>").text("5-Day Forecast:")
            fiveDayHeader.append(fdh);
            for(i = 3; i < data.list.length; i += 8) {
                console.log(data.list[i].dt);
                var forecastBox = $("<div>").addClass("forecast-box col-2");
                var forecastHeader = $("<h3>").addClass("forecast-header").text(dayjs.unix(data.list[i].dt).format("M/D/YY"))
                forecastBox.append(forecastHeader);
                var forecastList = $("<ul>");
                var forecastTemp = $("<li>").html(`Temp: ${data.list[i].main.temp}&deg;F`);
                var forecastWind = $("<li>").text(`Wind: ${data.list[i].wind.speed}mph`);
                var forecastHum = $("<li>").text(`Humidity: ${data.list[i].main.humidity}%`);
                forecastList.append(forecastTemp, forecastWind, forecastHum);
                forecastBox.append(forecastList);
                fiveDayForecast.append(forecastBox);
            }
            
        })
}

function searchCity(city) {

}

getCoords("San Francisco");