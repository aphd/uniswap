const endpoint = 'https://gateway.thegraph.com/api/deployments/id/QmTZ8ejXJxRo7vDBS4uwqBeGoxLSWbhaA7oXa1RvxunLy7';  // Replace with your actual GraphQL endpoint

const headers = {
    'Accept': 'application/json',
    'X-REQUEST-TYPE': 'GraphQL',
    'Authorization': 'Bearer 944b560e76f53abf0739468966998887', // Replace with your actual Bearer token
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

    return await response.json();;


};

module.exports = { fetchData };