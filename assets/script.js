
const apiKey = "dbe70ed951c286d1b52a29ff59300528";
const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("searchbtn")
// fetch(urlApi2)
//   .then(function (response) {
//     if (!response.ok) {
//       console.log(response.status);
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log("API DATA:", data);
//   })
//   .catch(error => {
//     console.error("Fetch error:", error);
//   });
function handleSearchSubmit() {
  let city = searchInput.value
  getCoords(city)
}
function getCoords(city) {
  let urlApi1 = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  fetch(urlApi1)
    .then(function (response) {
      return response.json()
    }).then(function (data) {
      console.log(data)
      let lat = data[0].lat
      let lon = data[0].lon
      const urlApi2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      fetch(urlApi2)
        .then(function (response) {
          return response.json()
        }).then(function (data) {
          console.log(data)
          displayCurrentWeather(data)
          const urlApi3 = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`;
          fetch(urlApi3)
            .then(function (response) {
              return response.json()
            }).then(function (data) {
              console.log(data)
              displayForecastWeather(data.list)
            })
        })

    })
}
function displayForecastWeather(data) {
  const forecastContainer = document.getElementById("5-day-forecast");
  forecastContainer.innerHTML = "";

  const forecastDataByDate = {};

  data.forEach((element) => {
    const dateUnix = element.dt;
    const date = dayjs.unix(dateUnix).format("MM/DD/YYYY");

    if (!forecastDataByDate[date]) {
      forecastDataByDate[date] = element;
    }
  });

  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const date = dayjs(today).add(i, 'day').format("MM/DD/YYYY");

    if (forecastDataByDate[date]) {
      const element = forecastDataByDate[date];
      const temperature = element.main.temp + "F";
      const humidity = element.main.humidity + "%";
      const wind = element.wind.speed + "MPH";
      const iconUrl = `https://openweathermap.org/img/w/${element.weather[0].icon}.png`;

      const forecastDiv = document.createElement("div");
      forecastDiv.classList.add("forecast-day");
      forecastDiv.classList.add("inline-block");

      forecastDiv.innerHTML = `
        <p>Date: ${date}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${temperature}</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind: ${wind}</p>
      `;

      forecastContainer.appendChild(forecastDiv);
    }
  }
}





function displayCurrentWeather(data) {
  document.getElementById("cityname").textContent = data.name
  document.getElementById("date").textContent = dayjs.unix(data.dt).format("MM/DD/YYYY")
  document.getElementById("icon").src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
  document.getElementById("temp").textContent = data.main.temp + "F"
  document.getElementById("humidity").textContent = data.main.humidity + "%"
  document.getElementById("wind").textContent = data.wind.speed + "MPH"
}
searchBtn.addEventListener("click", handleSearchSubmit)


