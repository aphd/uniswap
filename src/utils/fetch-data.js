const endpoint = 'https://thegraph.com/explorer/api/playground/QmTZ8ejXJxRo7vDBS4uwqBeGoxLSWbhaA7oXa1RvxunLy7';  

const headers = {
    'Accept': 'application/json',
    'X-REQUEST-TYPE': 'GraphQL',
    'Origin': 'https://thegraph.com',
    'Content-Type': 'application/json'
};

const fetchData = async (query, variables) => {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query, variables })
    });

    // Ensure the response is successful
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const json = await response.json();
    return json;


};

module.exports = { fetchData };