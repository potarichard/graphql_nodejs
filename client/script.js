const continentSelect = document.getElementById('continent-select')
const countryList = document.getElementById('countries-list')

const query_continents = 
`query {
  continents {
      name
      code
  }
}`

const query_with_variable = 
`query getCountries($code: ID!) {
  continent(code: $code) {
    countries {
      name
    }
  }
}`

queryFetch(query_continents).then(data => { data.data.continents.forEach(continent => 
      {
        const option = document.createElement('option')
        option.value = continent.code
        option.innerText = continent.name
        continentSelect.append(option)
      })
    })

continentSelect.addEventListener('change', async e => 
{
  const continentCode = e.target.value
  const countries = await getContinentCountries(continentCode)
  countryList.innerHTML = ''

  countries.forEach(country => 
    {
      const element = document.createElement('div')
      element.innerText = country.name
      countryList.append(element)
    })
})

function getContinentCountries(continentCode) 
{   
  return queryFetch(query_with_variable, { code: continentCode }).then(data => data.data.continent.countries);
}

// ez egy promiset ad vissza jsonbe
function queryFetch(query, variables) {
  return fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }).then(res => res.json())
}