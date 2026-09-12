import { useEffect, useState } from "react"
import axios from 'axios'
import Country from "./components/Country";
import CountryList from "./components/CountryList";
import Search from "./components/Search";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
      })
  }, [])

  const matchingCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  return (
    <>
      <Search search={search} handleSearch={handleSearch} />

      {search && matchingCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {search && matchingCountries.length >= 2 &&
        matchingCountries.length <= 10 && (
          <CountryList
            countries={matchingCountries}
            setSelectedCountry={setSelectedCountry}
          />
        )}

      {search && matchingCountries.length === 1 && (
        <Country country={matchingCountries[0]} />
      )}

      {selectedCountry && (
        <Country country={selectedCountry} />
      )}
    </>
  )
}

export default App
