// console.log("hello jee");
// const API_KEY = "979bbfa97997c5b9b919ecb7041cb8ca";
// function renderWeatherInfo(data) {
//   let newPara = document.createElement("p");
//   newPara.textContent = `${data?.main?.temp.toFixed(2)}°C`;
//   document.body.appendChild(newPara);
// }
// async function FetchWeather() {
//   // let latitute =15.3333;
//   // let longitute = 74.0833;
//   try {
//     let city = "goa";
//     const reponse = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
//     );
//     const data = await reponse.json();
//     console.log("Weather data:-> ", data);
//     renderWeatherInfo(data);
//     // let newPara = document.createElement("p");
//     // newPara.textContent = `${data?.main?.temp.toFixed(2)}°C`; // toFixed() is method that formate a number with a specified number of then after the decimal point.
//     // document.body.appendChild(newPara);
//   } catch (err) {
//     // hendle the error here
//   }
// }
// async function getCustomWeatherDetails() {
//   let latitude = 15.8788;
//   let longitute = 17.98983;
//   try{
//     let result = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitute}&appid=${API_KEY}`
//     );
//     let data = await result.json();
//     // console.log(data);
//     renderWeatherInfo(data)
//   }
//   catch(err){
//   console.log("error found", err);
//   }

// }
//   // tab switching function
// function switchTab(newtab){
//   apiErrorContainer.classList.remove("active");
//   if(newtab!==oldTab)
//   {
//     oldTab.clickeList.remove("current-tab");
//     oldTab= newtab;
//     oldTab.classList.add("current-tab");

//     if(!searchForm.classList.contains("active"))
//     {
//       userInfoContainer.classList.remove("active");
//       grantAccessContainer.classList.remove("active");
//       searchForm.classList.add("active");
//     }
//     else
//     {
//       searchForm.classList.remove("active");
//       userInfoContainer.classList.remove("active");

//     }
//     // console.log("Current Tab" , oldTab);
//   }
// }

// // current location fucntion
// function getLocation()
// {
//   if(navigator.geolocation)
//   {
//     navigator.geolocation.getCurrentPosition(ShowPosition);
//   }
//   else
//   console.log("No location");
// }

// function ShowPosition(position){
//   let lat = position.coords.latitude;
//   let longi = position.coords.longitute;
//   console.log(lat);
//   console.log(longi);
// }


const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "979bbfa97997c5b9b919ecb7041cb8ca";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
      }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fetch the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C
    `;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("no gelolocation support available"); 
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
    }
}