"use strict";

// variables
const countryNameInput = document.querySelector(".country-input");
const buttonEl = $(".btn");
const hourlyContainerEl = document.querySelector(".hourly-container");
const showHourlyEl = document.querySelector(".hourly-show");
const inputDivCardEl = document.querySelector(".input-div-card");
const hourWeatherEl = document.querySelector(".hour-weather");
const subDivInputEl = document.querySelector(".subdiv-input");

function calculateTime(time) {
  const h = Math.floor(time.split(" ")[1].split(":")[0]);
  let am = true;
  if (h > 12 ? (am = false) : (am = true));
  const hour = `${h > 12 ? h - 12 : h}`.padStart(2, 0);
  const minutes = `${Math.floor(time.split(" ")[1].split(":")[1])}`.padStart(
    2,
    0
  );
  return `${time.split(" ")[0]} | ${hour}:${minutes} ${am ? "AM" : "PM"}`;
}

const getWeather = async function (city) {
  try {
    const weather = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=d129a4c2e5eb455a87c143026232502&q=${city}&days=1&aqi=no&alerts=no`
    );
    if (weather.status === 400) {
      throw new Error("Country not found");
    }
    const data = await weather.json();
    const flag = await fetch(
      `https://countryflagsapi.com/svg/${data.location.country}`
    );
    //setting flag
    $(".flag").attr("src", `${flag.url}`);
    $(".card").removeClass("hidden");
    //setting weather information
    $(".country-name").text(`${data.location.country} | ${data.location.name}`);
    const time = calculateTime(data.location.localtime);
    $(".country-time").text(`${time}`);
    $(".conuntry-temp").text(`${data.current.feelslike_c}°C`);
    $(".weather-text").text(`${data.current.condition.text}`);
    $(".weather-img").attr("src", `${data.current.condition.icon}`);
    $(".winds").text(`${data.current.wind_kph}km/h`);
    $(".humidity").text(`${data.current.humidity}%`);
    $(".uvindex").text(`${data.current.uv}h`);

    //hourly weather
    const hourlyWeather = data.forecast.forecastday[0].hour;
    hourlyContainerEl.innerHTML = "";
    hourlyWeather.forEach((element) => {
      const html = `
      <div class="hourly d-flex justify-content-between">
          <p>${calculateTime(element.time)}</p>
          <img src="${element.condition.icon}" class="hourly-img" alt="" />
          <p>${element.temp_c}C</p>
          <p><span><i class="fa-sharp fa-solid fa-droplet"></i></span><span class="humidity">${
            element.humidity
          }%</span></p>
        </div>
      `;
      hourlyContainerEl.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    alert(err);
  }
};

buttonEl.click(function () {
  $(".card").addClass("hidden");
  const city = countryNameInput.value;
  inputDivCardEl.classList.remove("col-lg-6");
  inputDivCardEl.classList.add("col-lg-12");
  hourlyContainerEl.innerHTML = "";
  hourlyContainerEl.classList.add("hidden");
  countryNameInput.value = " ";
  countryNameInput.focus();
  getWeather(city);
});

showHourlyEl.addEventListener("click", function () {
  inputDivCardEl.classList.add("col-lg-6");
  inputDivCardEl.classList.remove("col-lg-12");
  subDivInputEl.setAttribute("width", "81%");
  hourlyContainerEl.classList.remove("hidden");
  countryNameInput.focus();
});

(function () {
  hourlyContainerEl.classList.add("hidden");
  getWeather("india");
  inputDivCardEl.classList.remove("col-lg-6");
  inputDivCardEl.classList.add("col-lg-12");
  countryNameInput.focus();
})();
