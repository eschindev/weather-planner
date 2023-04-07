var API_KEY = "b435488a41da2efd3cc26695a12e36f3";

var searchArea = $('#search-area');
var citySearchBtn = $('#city-search-button');
var citySearchBox = $('#city-search-box');
var currentDayOutput = $('#current-day-output');
var fiveDayHeader = $('#five-day-header');
var fiveDayForecast = $('#five-day-forecast');
var searchHistory = $('#search-history');



function getCoords(city) {
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
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
            // generate the card for current day
            currentDayOutput.addClass("current-day-class");
            var currentDayHeader = $("<h2>").text(`${data.name} on ${dayjs().format("M/D/YYYY")}`);
            currentDayOutput.append(currentDayHeader);
            var iconCode = data.weather[0].icon;
            var icon = $("<img>").attr("src", `https://openweathermap.org/img/w/${iconCode}.png`);
            currentDayOutput.append(icon);
            var currentTemp = $("<p>").html(`Temp: ${data.main.temp}&deg;F`);
            var currentWind = $("<p>").text(`Wind: ${data.wind.speed}mph`);
            var currentHum = $("<p>").text(`Humidity: ${data.main.humidity}%`);
            currentDayOutput.append(currentTemp, currentWind, currentHum);
        })
}

function getFiveDay(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //generate 5-day forecast header
            var fdh = $("<h2>").text("5-Day Forecast:")
            fiveDayHeader.html(fdh);
            // generate each card for the 5-day forecast and append to forecastBox
            for(i = 3; i < data.list.length; i += 8) {
                var forecastBox = $("<div>").addClass("forecast-box col-2");
                var forecastHeader = $("<h4>").addClass("forecast-header").text(dayjs.unix(data.list[i].dt).format("M/D/YY"))
                forecastBox.append(forecastHeader);
                var iconCode = data.list[i].weather[0].icon;
                var icon = $("<img>").attr("src", `https://openweathermap.org/img/w/${iconCode}.png`)
                forecastBox.append(icon);
                var forecastTemp = $("<p>").html(`Temp: ${data.list[i].main.temp}&deg;F`);
                var forecastWind = $("<p>").text(`Wind: ${data.list[i].wind.speed}mph`);
                var forecastHum = $("<p>").text(`Humidity: ${data.list[i].main.humidity}%`);
                forecastBox.append(forecastTemp, forecastWind, forecastHum);
                fiveDayForecast.append(forecastBox);
            }
            
        })
}
// function that receives the event and handles checking localStorage, and determines how to proceed based on event target
function searchCity(event) {
    event.preventDefault();
    if (event.target.id === "city-search-btn"){
        var city = citySearchBox.val();
        if (city === "") {
            window.alert("Please enter a city before searching.");
            return;
        }
        if (!localStorage.getItem(city)) {
            localStorage.setItem(city, "weather-planner");
        }
    } else {
        var city = event.target.textContent;
    }
    getCoords(city);
}
// Creates buttons for search history from localStorage, checking to make sure they originated from this application using value to store that info
function buttonsFromLS() {
    searchHistory.empty();
    for (i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) === "weather-planner"){
            var histButton = $("<button>").addClass("custom-btn my-1").text(localStorage.key(i));
            searchHistory.append(histButton);
        }
    }
}
// render buttons on page load
buttonsFromLS();
// listen for submit on form, or click on either form or history buttons
searchArea.on("click submit", ".custom-btn", searchCity);
