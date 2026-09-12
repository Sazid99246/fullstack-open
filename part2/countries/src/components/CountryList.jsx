const CountryList = ({ countries, setSelectedCountry }) => {
  return (
    <div>
      {countries.map(country => (
        <p key={country.cca3}>
          {country.name.common}
          <button onClick={() => setSelectedCountry(country)}>
            Show
          </button>
        </p>
      ))}
    </div>
  )
}

export default CountryList
