myAPIKey = "6154cf8838c9c9dbac1b04b0bb7dad21";

cityInputField = document.getElementById("cityInput");
stateInputField = document.getElementById("stateInput");
// search function to clear out the input field after clicking search button
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    if (cityInputField.value == "" || stateInputField.value == "") {
        return;
    };

    cityInput = document.getElementById("cityInput").value.trim();
    stateInput = document.getElementById("stateInput").value.trim();
    searchHistory();
    getGeoCoordinates();
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

function getGeoCoordinates() {
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

                        // get request results in 401 error (unauthorized)
                        weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + geoLat + "&lon=" + geoLon + "&exclude=minutely,hourly,alerts&appid=" + myAPIKey;

                        fetch(weatherURL)
                            .then(function (response) {
                                if (response.ok) {
                                    return response.json()
                                        .then(function (data) {
                                            console.log(data);
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