
const apiKey = "dbe70ed951c286d1b52a29ff59300528";
const majorCitiesList = document.getElementById("major-cities-list");
const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("searchbtn")
let cities =JSON.parse(localStorage.getItem('cities')) || []
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
function renderHistorybtns(){
  majorCitiesList.innerHTML=""
  cities.forEach(city=>{
    let btn =document.createElement('button')
    btn.textContent=city
    btn.classList.add('blue-button')
    majorCitiesList.appendChild(btn)
  })
}
renderHistorybtns()
function getCoords(city) {
  let urlApi1 = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  fetch(urlApi1)
    .then(function (response) {
      return response.json()
    }).then(function (data) {
      if (cities.indexOf(city)===-1){
        cities.unshift(city)
        localStorage.setItem('cities',JSON.stringify(cities))
        renderHistorybtns()
      }
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

const majorCities = [
  "Atlanta",
  "Denver",
  "Seattle",
  "San Francisco",
  "Orlando",
  "New York",
  "Chicago",
  "Austin",
];

majorCitiesList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    searchInput.value = event.target.textContent;
    searchBtn.click(); 
  }
});

function populateCitySelect() {
  const citySelect = document.getElementById("major-cities");
  
  majorCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

window.addEventListener("load", populateCitySelect);

function displayForecastWeather(data) {
  const forecastContainer = document.getElementById("five-day-forecast");
  forecastContainer.innerHTML = "";
  for (let i = 5; i < data.length; i+=8) {
    const date = dayjs.unix(data[i].dt).format("MM/DD/YYYY");
    const temperature = data[i].main.temp + "F";
      const humidity = data[i].main.humidity + "%";
      const wind = data[i].wind.speed + "MPH";
      const iconUrl = `https://openweathermap.org/img/w/${data[i].weather[0].icon}.png`;

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

function handleHistoryClick(e){
  if (!e.target.matches('.blue-button')) return
  getCoords(e.target.textContent)
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

majorCitiesList.addEventListener('click', handleHistoryClick)
