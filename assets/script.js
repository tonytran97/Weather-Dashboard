myAPIKey = "6154cf8838c9c9dbac1b04b0bb7dad21";

cityInputField = document.getElementById("cityInput");
stateInputField = document.getElementById("stateInput");

var currentDay = moment().format("dddd, MMMM Do YYYY");

// search function to clear out the input field after clicking search button
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    if (cityInputField.value == "" || stateInputField.value == "") {
        return;
    };

    cityInput = document.getElementById("cityInput").value.trim();
    stateInput = document.getElementById("stateInput").value.trim();
    searchHistory();
    getCurrentWeather();
    // getWeatherTest();
    cityInputField.value = "";
    stateInputField.value = "";
})

// takes value from input field, creates a button, and stores it under the Search History
function searchHistory() {
    btn = document.createElement("button");
    btn.textContent = cityInput + "," + stateInput;
    document.getElementById("history").append(btn);
}

// features of the current weather, still missing icon
function getCurrentWeather() {
    var date = $("<div>");
    var cityName = $("<div>");
    var temp = $("<div>");
    var wind = $("<div>");
    var humidity = $("<div>");
    var uvIndex = $("<div id=uvIndexColor>");

    date.text(currentDay);
    cityName.text(cityInput.toUpperCase() + ", " + stateInput.toUpperCase());
    document.querySelector("img").setAttribute("id", "weatherIcon");

    $("#current").append(date);
    $("#current").append(cityName);
    $("#current").append(temp);
    $("#current").append(wind);
    $("#current").append(humidity);
    $("#current").append(uvIndex);

    geoCoordinatesURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInputField.value + "," + stateInputField.value + ",US" + "&limit=5&appid=" + myAPIKey;
    // user inputs are incorporated into a URL which we then fetch
    fetch(geoCoordinatesURL)

        .then(function (response) {
            if (response.ok) {
                return response.json()
                    .then(function (data) {
                        // longitude and latitude of that location is then recorded into variables
                        geoLon = data[0].lon;
                        geoLat = data[0].lat;

                        weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + myAPIKey;

                        fetch(weatherURL)
                            .then(function (response) {
                                if (response.ok) {
                                    return response.json()
                                        .then(function (weatherData) {
                                            console.log(weatherData);

                                            temp.text("Temp: " + weatherData.current.temp + "°F");
                                            wind.text("Wind: " + weatherData.current.wind_speed + " MPH");
                                            humidity.text("Humidity: " + weatherData.current.humidity + "%");
                                            uvIndex.text("UV Index: " + weatherData.current.uvi);

                                            // if else statements to change the color of UV Index depending on the current value
                                            if (weatherData.current.uvi === 0 || weatherData.current.uvi <= 2) {
                                                // favorable
                                                $("#uvIndexColor").css("background-color", "green");
                                            } else if (weatherData.current.uvi <= 5) {
                                                // moderate
                                                $("#uvIndexColor").css("background-color", "yellow");
                                            } else {
                                                // severe
                                                $("#uvIndexColor").css("background-color", "red");
                                            };

                                            var iconCode = weatherData.current.weather[0].icon;
                                            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                                            $("#weatherIcon").attr('src', iconURL);
                                            // console.log(cityName);
                                            // generating future forecast
                                            for (i = 1; i < 6; i++) {
                                                var futureInfo = {
                                                    icon: weatherData.daily[i].weather[0].icon,
                                                    temp: weatherData.daily[i].temp.day,
                                                    humidity: weatherData.daily[i].humidity,
                                                }
                                                // var iconCodeFuture = weatherData.daily[0 + i].weather[0].icon;
                                                var iconURLFuture = `<img src="https://openweathermap.org/img/w/${futureInfo.icon}.png" />`;
                                                var futureDates = moment().add(i, 'days').format("dddd, MMMM Do YYYY")
                                                var futureForecast = $(`<div class="card-body">
                                                <div>${futureDates}${iconURLFuture}</div>
                                                <p>Temp: ${futureInfo.temp} °F</p>
                                                <p>Humidity: ${futureInfo.humidity}\%</p>
                                                </div>
                                                </div>
                                                <div>
                                                `);
                                                $("#future").append(futureForecast);
                                            };

                                        })
                                }
                            })
                    })
            }
        })

}



// test purposes
function getWeatherTest() {
    weatherURLTest = "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + myAPIKey;
    fetch(weatherURLTest)
        .then(function (response) {
            if (response.ok) {
                return response.json()
                    .then(function (data) {
                        console.log(data);
                    })
            }
        })
}