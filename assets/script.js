// global DOM references
cityInputField = document.getElementById("cityInput");
stateInputField = document.getElementById("stateInput");

var currentDay = moment().format("dddd, MMMM Do");

// empty array that is used to store the inputs from the previous session, empty array also serves as a localStorage.clear() in order to prevent overcluttered search history
var locationHistory = [];

// gathers the data from the localStorage
function getLocation() {
    var locationStorage = localStorage.getItem("location");
    if (locationStorage !== null) {
        locationArray = JSON.parse(locationStorage);
        return locationArray;
    } else {
        locationArray = [];
    }
    return locationArray;
}

// uses localStorage data to automatically insert buttons from recent history
function renderLocation() {
    historyList = getLocation();
    for (var i = 0; i < historyList.length; i++) {
        btnHistory = document.createElement("button");
        btnHistory.classList.add("historyList");
        btnHistory.textContent = historyList[i];
        document.getElementById("history").append(btnHistory);
    }
}

// function is called during page loadup in order to pull information from localStorage
renderLocation();

// search function to clear out the input field after clicking search button
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    if (cityInputField.value == "" || stateInputField.value == "") {
        $("#alert").text("In order to process your request, both the city and state fields must have an input");
        return;
    } else {
        $("#alert").empty();
    };
    // resets the current weather and forecast boxes
    $(".fs-4").empty();
    $("#future").empty();
    cityInput = document.getElementById("cityInput").value.trim();
    // used to capitalize the first letter of the city name for button creation
    cityInputUpperCase = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
    console.log(cityInputUpperCase);
    stateInput = document.getElementById("stateInput").value.toUpperCase().trim();
    searchHistory();
    getCurrentWeather();
    // empty the input fields for a clean UI
    cityInputField.value = "";
    stateInputField.value = "";
})

// takes value from input field, creates a button, and stores it under the Search History
function searchHistory() {
    btn = document.createElement("button");
    btn.classList.add("historyList");
    btn.textContent = cityInputUpperCase + ", " + stateInput;
    document.getElementById("history").append(btn);
    locationHistory.push(btn.textContent);

    localStorage.setItem("location", JSON.stringify(locationHistory));
}

function getCurrentWeather() {
    var currentContainer = $("<div class='fs-4'>")
    var cityName = $("<div class='text-capitalize'>");
    var temp = $("<div>");
    var wind = $("<div>");
    var humidity = $("<div>");
    var uvIndex = $("<div>");

    cityName.text(cityInput + ", " + stateInput.toUpperCase() + " (" + currentDay + ")");

    $("#current").append(currentContainer);
    $(currentContainer).append(cityName);
    $(currentContainer).append(temp);
    $(currentContainer).append(wind);
    $(currentContainer).append(humidity);
    $(currentContainer).append(uvIndex);

    geoCoordinatesURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInputField.value + "," + stateInputField.value + ",US" + "&limit=5&appid=6154cf8838c9c9dbac1b04b0bb7dad21";
    // user inputs are incorporated into a URL which we then fetch
    fetch(geoCoordinatesURL)

        .then(function (response) {
            if (response.ok) {
                return response.json()
                    .then(function (data) {
                        // longitude and latitude of that location is then recorded into variables
                        geoLon = data[0].lon;
                        geoLat = data[0].lat;

                        weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=minutely,hourly,alerts&units=imperial&appid=6154cf8838c9c9dbac1b04b0bb7dad21";

                        fetch(weatherURL)
                            .then(function (response) {
                                if (response.ok) {
                                    return response.json()
                                        .then(function (weatherData) {

                                            temp.text("Temp: " + weatherData.current.temp + "°F");
                                            wind.text("Wind: " + weatherData.current.wind_speed + " MPH");
                                            humidity.text("Humidity: " + weatherData.current.humidity + "%");

                                            var indexValue = weatherData.current.uvi;
                                            var indexContent = $(`<p>UV Index:
                                            <span id="uvIndexColor">${indexValue}</span>
                                            </p>`
                                            );
                                            $(uvIndex).append(indexContent);

                                            // if else statements to change the color of UV Index depending on the current value
                                            if (weatherData.current.uvi <= 2) {
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
                                            var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                                            $("#weatherIcon").attr('src', iconURL);

                                            // generating future forecast
                                            for (i = 1; i < 6; i++) {
                                                var futureInfo = {
                                                    icon: weatherData.daily[i].weather[0].icon,
                                                    temp: weatherData.daily[i].temp.day,
                                                    wind: weatherData.daily[i].wind_speed,
                                                    humidity: weatherData.daily[i].humidity,
                                                }
                                                // var iconCodeFuture = weatherData.daily[0 + i].weather[0].icon;
                                                var iconURLFuture = `<img src="https://openweathermap.org/img/w/${futureInfo.icon}.png" />`;
                                                var futureDates = moment().add(i, 'days').format("dddd, MMMM Do")
                                                var futureForecast = $(`<div class="card-body">
                                                <div>${futureDates}${iconURLFuture}</div>
                                                <p>Temp: ${futureInfo.temp} °F</p>
                                                <p>Wind: ${futureInfo.wind} MPH</p>
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
                    .catch(function (error) {
                        $("#alert").text("Unable to process your request, please try again with different inputs or come back at another time");
                    })
            }
        })

}

// long complicated way to get this to work
$(document).on("click", ".historyList", function (event) {
    event.preventDefault();
    // resets the current weather and forecast boxes
    $(".fs-4").empty();
    $("#future").empty();
    // complicated method to separate the text from whichever button is clicked to a city and state string
    var clickHistory = $(this).text();
    var string = JSON.stringify(clickHistory);
    var splitString = string.split(",").shift();
    cityString = splitString.replace('"', '');
    var splitStringState = string.split(" ").pop();
    stateString = splitStringState.replace('"', '');

    function getBtnWeather() {
        var currentContainer = $("<div class='fs-4'>")
        var cityName = $("<div class='text-capitalize'>");
        var temp = $("<div>");
        var wind = $("<div>");
        var humidity = $("<div>");
        var uvIndex = $("<div>");

        cityName.text(cityString + ", " + stateString + " (" + currentDay + ")");

        $("#current").append(currentContainer);
        $(currentContainer).append(cityName);
        $(currentContainer).append(temp);
        $(currentContainer).append(wind);
        $(currentContainer).append(humidity);
        $(currentContainer).append(uvIndex);

        geoCoordinatesURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityString + "," + stateString + ",US" + "&limit=5&appid=6154cf8838c9c9dbac1b04b0bb7dad21";
        // user inputs are incorporated into a URL which we then fetch
        fetch(geoCoordinatesURL)

            .then(function (response) {
                if (response.ok) {
                    return response.json()
                        .then(function (data) {
                            // longitude and latitude of that location is then recorded into variables
                            geoLon = data[0].lon;
                            geoLat = data[0].lat;

                            weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=minutely,hourly,alerts&units=imperial&appid=6154cf8838c9c9dbac1b04b0bb7dad21";

                            fetch(weatherURL)
                                .then(function (response) {
                                    if (response.ok) {
                                        return response.json()
                                            .then(function (weatherData) {
                                                console.log(weatherData);

                                                temp.text("Temp: " + weatherData.current.temp + "°F");
                                                wind.text("Wind: " + weatherData.current.wind_speed + " MPH");
                                                humidity.text("Humidity: " + weatherData.current.humidity + "%");

                                                var indexValue = weatherData.current.uvi;
                                                var indexContent = $(`<p>UV Index:
                                                <span id="uvIndexColor">${indexValue}</span>
                                                </p>`
                                                );
                                                $(uvIndex).append(indexContent);

                                                // if else statements to change the color of UV Index depending on the current value
                                                if (weatherData.current.uvi <= 2) {
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
                                                var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                                                $("#weatherIcon").attr('src', iconURL);

                                                // generating future forecast
                                                for (i = 1; i < 6; i++) {
                                                    var futureInfo = {
                                                        icon: weatherData.daily[i].weather[0].icon,
                                                        temp: weatherData.daily[i].temp.day,
                                                        wind: weatherData.daily[i].wind_speed,
                                                        humidity: weatherData.daily[i].humidity,
                                                    }
                                                    // var iconCodeFuture = weatherData.daily[0 + i].weather[0].icon;
                                                    var iconURLFuture = `<img src="https://openweathermap.org/img/w/${futureInfo.icon}.png" />`;
                                                    var futureDates = moment().add(i, 'days').format("dddd, MMMM Do")
                                                    var futureForecast = $(`<div class="card-body">
                                                    <div>${futureDates}${iconURLFuture}</div>
                                                    <p>Temp: ${futureInfo.temp} °F</p>
                                                    <p>Wind: ${futureInfo.wind} MPH</p>
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
    getBtnWeather();
})