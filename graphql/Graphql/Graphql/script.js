const continentSelect = document.getElementById('continent-select');
const countryList = document.getElementById('countries-list');

queryFetch(`
  query {
    continents {
      name
      code
    }
  }
`).then(data => {
  data.data.continents.forEach(continent => {
    const option = document.createElement('option');
    option.value = continent.code;
    option.innerText = continent.name;
    continentSelect.append(option);
  });
}).catch(error => {
  console.error("Error fetching continents:", error);
});


continentSelect.addEventListener('change', async e => {
  const continentCode = e.target.value;
  try {
    const countries = await getContinentCountries(continentCode);
    countryList.innerHTML = '';  // Clear previous list
    countries.forEach(country => {
      const element = document.createElement('div');
      element.innerText = country.name;
      countryList.append(element);
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
});

function getContinentCountries(continentCode) {
  const query = `
    query {
      continent(code: "${continentCode}") {
        countries {
          name
          code
        }
      }
    }
  `;
  console.log("Query:", query);  
  return queryFetch(query).then(data => {
    console.log("API Response:", data);
    if (!data.data || !data.data.continent) {
      throw new Error("Invalid API response: Continent data is undefined");
    }
    return data.data.continent.countries;
  });
}


function queryFetch(query, variables = {}) {
  return fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }).then(res => res.json());
}
