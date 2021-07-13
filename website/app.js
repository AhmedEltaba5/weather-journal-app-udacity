/* Global Variables */
const dateDiv = document.getElementById('date');
const tempDiv = document.getElementById('temp');
const contentDiv = document.getElementById('content');
const zipInput = document.getElementById('zip');
const feelingInput = document.getElementById('feelings');
// Base URL and API Key for OpenWeatherMap API
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=fd3d6d3ce391709aaddd9d1b5c04151c';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to process data
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
  e.preventDefault();
  // get user input values
  const zipNum = zipInput.value;
  const content = feelingInput.value;

  //console.log(getWeatherData(baseURL, zipNum, apiKey));

  getWeatherData(baseURL, zipNum, apiKey).then(function (userData) {
      // add data to POST request
      postData('/send', { date: newDate, temp: userData.main.temp, content })
    }).then( function(data) {
      // call updateUI to update browser content
      updateUI();
    })
    
}


/* get weather data from the API*/
const getWeatherData = async (baseURL, zipNum, apiKey) => {
  // fetch the url
  const res = await fetch(baseURL + zipNum + apiKey);
  try {
    // get api result
    const weatherData = await res.json();
    return weatherData;
  } catch (error) {
    console.log("error", error);
  }
}

/* POST data to server*/
const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      date: data.date,
      temp: data.temp,
      content: data.content
    })
  })

  try {
    const newData = await req.json();
    return newData;
  }
  catch (error) {
    console.log(error);
  }
};

//send data back to user with get request
const updateUI = async () => {
  //fetch get Route
  const request = await fetch('/all');
  try {
    const allData = await request.json()
    // update new entry values
    dateDiv.innerHTML = allData.date;
    tempDiv.innerHTML = allData.temp;
    contentDiv.innerHTML = allData.content;
    //empty input values
    zipInput.value='';
    feelingInput.value='';
  }
  catch (error) {
    console.log("error", error);
  }
};