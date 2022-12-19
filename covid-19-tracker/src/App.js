import React, { useState,useEffect } from "react"
import{
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import InfoBox from "./InfoBox";
import Map from "./Map";
import './App.css';
import Table from "./Table"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data => {setCountryInfo(data);});
  }, []);

  //STATE = how to write a variable in REACT
  //https://disease.sh/v3/covid-19/countries

  // USEEFFECT = Runs a piece of code based on a given condition 

  useEffect(() => {
    // The code inside here will run once when the component loads and not again
    // async -> send a request, wait for it, do something with info

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, //United States, United Kingdon
            value: country.countryInfo.iso2, //UK, USA, FR
          }));
          setTableData(data);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode); 
      // all of the data from the country response
      setCountryInfo(data);
    });
  };

  console.log("COUNTRY INFO >>>", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            {/* Loop through all the countries and show a drop down list of the options */}
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country =>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox title="Coronoavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
        <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
        <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
      </div>

      {/* Map */}
      <Map/>
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
        <h3>Worldwide new cases</h3>
        {/* Graph */}
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
