cityInputField = document.getElementById("cityInput");
// search function to clear out the input field after clicking search button
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    if (cityInputField.value == "") {
        return;
    };
    cityInput = document.getElementById("cityInput").value.trim();
    cityInputField.value = '';
    console.log(cityInput);
    searchHistory();
})

// takes value from input field, creates a button, and stores it under the Search History
function searchHistory() {
    btn = document.createElement("button");
    btn.textContent = cityInput;
    document.getElementById("history").append(btn);
}
