var API_KEY = "b435488a41da2efd3cc26695a12e36f3";


function getCoords(city) {
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            getCurrent(data[0].lat, data[0].lon);
            getFiveDay(data[0].lat, data[0].lon);
        })
}

function getFiveDay(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
}

function getCurrent(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function() {
            console.log(data);
        })
}


getCoords("San Francisco");