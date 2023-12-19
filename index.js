const userTab= document.querySelector("[data-Wheather]");
const searchTab= document.querySelector("[data-searchWheather]");
const  userContainer=document.querySelector(".weather-container");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm =document.querySelector("[data-searchForm]");
const  loadingScreen =document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionsStorage();

userTab.addEventListener("click", ()=>{
        switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
  switchTab(searchTab)
})

function switchTab(newTab){
  if(newTab!=oldTab){
    oldTab.classList.remove("current-tab");
    oldTab=newTab;
    oldTab.classList.add("current-tab");


    if(!searchForm.classList.contains("active")){
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
    else{
      
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionsStorage(); 

    }


  }
}



//check if cordinate are already store in session storage
function getfromSessionsStorage() {
  const localCoordinates= sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }

}

 async function fetchUserWeatherInfo(coordinates){
  const {lat,lon}=coordinates;

  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try{
    const response= await fetch(` 
      https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
      const data= await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      rendorWeatherInfo(data);


  }
  catch(err){
    loadingScreen.classList.remove("active");
    console.log("api not found");

  }
}

function rendorWeatherInfo(weatherInfo){
  const cityName=document.querySelector("[data-cityName]");
  const countryIcon= document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon= document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed=document.querySelector("[data-windSpeed]");
  const humidity= document.querySelector("[data-humidity]");
  const cloudiness= document.querySelector("[data-cloudiness]");
  cityName.innerText= weatherInfo?.name;
  countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText=weatherInfo?.weather?.[0]?.description;
  weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText =  `${weatherInfo?.main?.temp}  °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}  m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all} %`;

}

const  grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" ,getLocation);
function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);

  }
  else{
    alert("geo location not available");
  }
}

function showPosition(position){
   const userCoordinates={
    lat: position.coords.latitude,
    lon: position.coords.longitude,

   }
   sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
   fetchUserWeatherInfo(userCoordinates);
}





const searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) =>{
  e.preventDefault();
  let cityName=searchInput.value;
  if(cityName==""){
    return;
  }
  else{
    fetchSearchWeatherInfo(cityName);
  }

})

async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessButton.classList.remove("active");

  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric
    `);
    const data= await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    rendorWeatherInfo(data);
  }
  catch(err){

  }


}