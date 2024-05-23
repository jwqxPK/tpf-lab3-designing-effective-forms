let clickCount = 0;

//const countryInput = document.getElementById("country");
const countryInput = document.getElementById("country");
const myForm = document.getElementById("form");
const modal = document.getElementById("form-feedback-modal");
const clicksInfo = document.getElementById("click-count");

function handleClick() {
  clickCount++;
  clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Błąd pobierania danych");
    }
    const data = await response.json();
    const countries = data.map((country) => country.name.common).sort();
    countryInput.innerHTML = countries
      .map((country) => `<option value="${country}">${country}</option>`)
      .join("");
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
}

function getCountryByIP() {
  fetch("https://get.geojs.io/v1/ip/geo.json")
    .then((response) => response.json())
    .then((data) => {
      const country = data.country;
      // TODO inject country to form and call getCountryCode(country) function
      countryInput.value = country;
      getCountryCode(country);
    })
    .catch((error) => {
      console.error("Błąd pobierania danych z serwera GeoJS:", error);
    });
}

function getCountryCode(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Błąd pobierania danych");
      }
      return response.json();
    })
    .then((data) => {
      const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
      // TODO inject countryCode to form
      const countryCodeSelect = document.getElementById("countryCode");
      countryCodeSelect.value = countryCode;
    })
    .catch((error) => {
      console.error("Wystąpił błąd:", error);
    });
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".form-section");
  sections.forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
}

(() => {
  // nasłuchiwania na zdarzenie kliknięcia myszką
  document.addEventListener("click", handleClick);

  fetchAndFillCountries();
  getCountryByIP();
})();
