import React, {Component} from 'react';
import { geolocated } from "react-geolocated";
import './App.css';
import { HashRouter as Router , Switch, Route } from 'react-router-dom';
import SignUp from "./components/acc/SignUp";
import Clothes from "./components/pages/Clothes";
import Weather from "./components/pages/Weather";
import News from "./components/pages/News";
import Sport from "./components/pages/Sport";
import Photos from "./components/pages/Photos";
import Tasks from "./components/pages/Tasks";
import Dashboard from "./components/pages/Dashboard";
import DashboardTile from "./components/pages/DashboardTile";

//preloading icons for weather 
import sun from "./assets/icons/Sun_icon.png";
import rain from "./assets/icons/Rain_icon.png";
import cloud from "./assets/icons/Clouds_icon.png";

//test data - will change later
import dashboardData from "./assets/jsonTestData/dashboardData.json";

//news, sports, etc urls
const newsURL = "https://cors-anywhere.herokuapp.com/http://feeds.bbci.co.uk/news/rss.xml";
const sportURL = "https://cors-anywhere.herokuapp.com/http://feeds.bbci.co.uk/sport/football/rss.xml";
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=";
const weatherMagicKey = "&appid=d0a10211ea3d36b0a6423a104782130e&units=metric";
class App extends React.Component {
  

  constructor(){
    super()
    this.state = {
      newsFeed: {
        headline: "",
        description: "",
        placed: false
      },
      weatherFeed: {
        temp: "111",
        description: "",
        location: "",
        placed: false
      },
      sportFeed: {
        headline: "",
        description: "",
        placed: false
      },
      location: {
        lat: 0,
        long: 0
      }

    }
  }

  //get data about the dashboard tiles
  loadData(){
    const dashboardComponents = dashboardData.map(tile => {
    
      return (
        <DashboardTile 
        tilePage ={tile.URL}
        title={tile.title} 
        content={tile.content}/>
      )
    })
    return dashboardComponents
  }

 

  fetchNewsData(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
 
      if(request.readyState == 4 && request.status == 200){  
        var x = request.responseXML.getElementsByTagName("title")[2].textContent;
        var y = request.responseXML.getElementsByTagName("description")[1].textContent;
          this.setState({
           newsFeed: {
             headline: x,
             description: y
            }
          })  
          {this.placeNews()}
      }
    }
    request.open("GET", newsURL, true);
    request.send();
  }

  fetchSportsData(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
 
      if(request.readyState == 4 && request.status == 200){  
        var x = request.responseXML.getElementsByTagName("title")[2].textContent;
        var y = request.responseXML.getElementsByTagName("description")[1].textContent;
          this.setState({
           sportFeed: {
             headline: x,
             description: y
            }
          })  
          {this.placeSport()}
      }
    }
    request.open("GET", sportURL, true);
    request.send();
  }

  componentDidMount(){

    {this.fetchNewsData()}
    {this.fetchSportsData()}
    {this.getLocation()}

    
  }

   getWeatherData(){
    var wURL = weatherURL + this.state.location.lat + "&lon=" + this.state.location.long + weatherMagicKey;
    fetch(wURL)
      .then(response => response.json())
      .then(json => {
        var temp = Math.round(json.main.temp);
        var description = json.weather[0].main;
        var location = json.name;
        this.setWeatherData(temp, description, location);
         
      }
      
      )
  }

  setWeatherData(t, d, l){
    this.setState({
      weatherFeed: {
        temp:t,
        description: d,
        location: l
       }
     })
     this.placeWeather();
  }

  getLocation(){
    if(navigator.geolocation) {
      var lat = 0;
      var long = 1;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude;
          long = position.coords.longitude;
          this.setLocation(lat,long);
        }

      );
     } 
     else {
       alert("Geolocation is not supported by this browser.");
      }
      
  }

  setLocation(latitide, longitude){
    this.setState({
      location: {
        lat: latitide,
        long: longitude
       }
     })
     this.getWeatherData()
  }

  /*
                  <div weatherContainer>
                    <div>TOP Container
                      <div>Icon</div> 
                      <div>RightMidDiv
                        <div>degreesNum</div>
                        <div>degreesText</div>
                      </div>
                    </div>
                    <div>Bottom Conatainer</div>
                  </div>
  */

  placeWeather(){
    var i = this.determineIcon();
    var l = this.state.weatherFeed.location;
    var t = this.state.weatherFeed.temp;

    var weather = document.getElementById("Weather");

    var degrees = document.createElement("h3");
    var temp = document.createElement("h3"); 
    var location = document.createElement("h2"); 
    var icon = document.createElement("img");
    var weatherContainer = document.createElement("div");
    var topContainer = document.createElement("div");
    var bottomContainer = document.createElement("div");
    var imgDiv = document.createElement("div");
    var infoDiv = document.createElement("div");
    var tContent = document.createTextNode(t); 
    var lContent = document.createTextNode(l); 
    var dContent = document.createTextNode("Degrees");

    infoDiv.id = "weatherInfoDiv";
    topContainer.id = "topContainer";
    bottomContainer.id = "bottomContainer";
    location.id = "weatherLocation";
    imgDiv.id = "weatherImg";
    icon.src = i;
    weatherContainer.id = "weatherContainer";
    temp.id = "weatherTemp";
    degrees.id = "weatherDegreesText";

    console.log(this.state.weatherFeed.description);

    degrees.appendChild(dContent);
    imgDiv.appendChild(icon)
    location.appendChild(lContent);
    temp.appendChild(tContent);

    infoDiv.appendChild(temp);
    infoDiv.appendChild(degrees)

    topContainer.appendChild(imgDiv);
    topContainer.appendChild(infoDiv);
    bottomContainer.appendChild(location);

    weatherContainer.appendChild(topContainer);
    weatherContainer.appendChild(bottomContainer);


    if(weather != null && !this.state.weatherFeed.placed) {
      weather.appendChild(weatherContainer);

      //prevent multiple new elements
      this.setState({
        weatherFeed: {
          placed: true
         }
       })
    }


  }

  determineIcon(){
    var icon = "";
    console.log(this.state.weatherFeed.description);
    switch (this.state.weatherFeed.description) {
			case "Sunny":
        icon = "./assets/icons/Sun_icon.png";
        break;
			case "Overcast":
			case "Scattered Clouds":
			case "Partly Cloudy":
			case "Mostly Cloudy":
      case "Clouds":
				icon = "./assets/icons/Clouds_icon.png";
        break;
			case "Light Rain":
			case "Heavy Rain":
			case "Freezing Rain":
			case "Heavy Drizzle":
			case "Light Drizzle":
			case "Drizzle":
			case "Rain":
				icon = "./assets/icons/Rain_icon.png";
        break;
			//and so on
			default:
        icon = "./assets/icons/Clouds_icon.png";
        break;
    }
    return icon;
  }

  placeNews(){
    var news = document.getElementById("News");

    var description = document.createElement("p1"); 
    var headline = document.createElement("h3"); 
    var div = document.createElement("div");
    var hContent = document.createTextNode(this.state.newsFeed.headline); 
    var pContent = document.createTextNode(this.state.newsFeed.description); 
    headline.appendChild(hContent);
    description.appendChild(pContent);
    div.appendChild(headline);
    div.appendChild(description);
    if(news != null && !this.state.newsFeed.placed) {
      news.appendChild(div);

      //prevent multiple new elements
      this.setState({
        newsFeed: {
          placed: true
         }
       })
    }
           
  }



  placeSport(){
    var sport = document.getElementById("Sport");

    var description = document.createElement("p1"); 
    var headline = document.createElement("h3"); 
    var hContent = document.createTextNode(this.state.sportFeed.headline); 
    var pContent = document.createTextNode(this.state.sportFeed.description); 
    headline.appendChild(hContent);
    description.appendChild(pContent);
    var placed = false;
    if(sport != null && !this.state.sportFeed.placed) {
      sport.appendChild(headline);
      sport.appendChild(description);

      //prevent multiple new elements
      this.setState({
        sportFeed: {
          placed: true
         }
       })

    }
           
  }

  render() {
    const dashboardComponents = this.loadData();
    return (
      <Router basename="/#/">  
        <div className="App">
          <div className = {"container"}>

            <Switch>
            {/* save for when registration + databse works
              <Route exact path = "/" component = {

                    SignUp
              }/>
            */}
              <Route path = "/signup" component = {SignUp} />

              <Route exact path = "/" exact render = {
                  () => (
                  <div>
                    <Dashboard>
                      {dashboardComponents}
                    </Dashboard>
                    
                    
                  </div>)}/>     

              <Route path = "/news" component = {News} />

              <Route path = "/sport" component = {Sport} />

              <Route path = "/photos" component = {Photos} /> 

              <Route path = "/tasks" component = {Tasks} /> 

              <Route path = "/clothes" component = {Clothes} /> 

            </Switch> 

          </div>    
          
        </div>
      </Router >
    );
  }
}


export default App;
