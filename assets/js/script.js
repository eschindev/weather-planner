var API_KEY = "b435488a41da2efd3cc26695a12e36f3";

var searchArea = $('#search-area');
var citySearchBtn = $('#city-search-button');
var citySearchBox = $('#city-search-box');
var currentDayOutput = $('#current-day-output');
var fiveDayHeader = $('#five-day-header');
var fiveDayForecast = $('#five-day-forecast');
var searchHistory = $('#search-history')



function getCoords(city) {
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("getCoords");
            console.log(data);
            currentDayOutput.empty();
            fiveDayForecast.empty();
            buttonsFromLS();
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

            //currentDayOutput.clear();
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
            fiveDayHeader.html(fdh);
            for(i = 3; i < data.list.length; i += 8) {
                console.log(data.list[i].dt);
                var forecastBox = $("<div>").addClass("forecast-box col-2");
                var forecastHeader = $("<h4>").addClass("forecast-header").text(dayjs.unix(data.list[i].dt).format("M/D/YY"))
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

function searchCity(event) {
    event.preventDefault();

    if (event.target.id === "city-search-btn"){
        var city = citySearchBox.val();
        if (!localStorage.getItem(city)) {
            localStorage.setItem(city, city);
        }
    } else {
        var city = event.target.textContent;
    }

    getCoords(city);
}

function buttonsFromLS() {
    searchHistory.empty();
    for (i = 0; i < localStorage.length; i++) {
        var histButton = $("<button>").addClass("custom-btn my-1").text(localStorage.key(i));
        searchHistory.append(histButton);
    }
}

buttonsFromLS();

searchArea.on("click", ".custom-btn", searchCity);
