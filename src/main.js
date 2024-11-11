const fs = require('fs');
const { parse } = require('json2csv');
const { getQuery } = require('./query')

const endpoint = 'https://gateway.thegraph.com/api/deployments/id/QmTZ8ejXJxRo7vDBS4uwqBeGoxLSWbhaA7oXa1RvxunLy7';  // Replace with your actual GraphQL endpoint

const variables = {
  startTime: 1672617600,  // Replace with your desired start time (Unix timestamp)
  endTime: 1672628660    // Replace with your desired end time (Unix timestamp)
};

// Function to flatten and extract burns and mints from the transactions
function flattenBurnsAndMints(transactions) {
  // Flatten the burns
  const flattenedBurns = transactions.flatMap(transaction =>
    transaction.burns.map(burn => ({
      id: transaction.id,
      timestamp: transaction.timestamp,
      feeTier: burn.pool.feeTier,
      poolId: burn.pool.id,
      token0: burn.pool.token0.symbol,
      token1: burn.pool.token1.symbol,
      tickLower: burn.tickLower,
      tickUpper: burn.tickUpper
    }))
  );

  // Flatten the mints (if any)
  const flattenedMints = transactions.flatMap(transaction =>
    transaction.mints.map(mint => ({
      id: transaction.id,
      timestamp: transaction.timestamp,
      feeTier: mint.pool.feeTier,
      poolId: mint.pool.id,
      token0: mint.pool.token0.symbol,
      token1: mint.pool.token1.symbol,
      tickLower: mint.tickLower,
      tickUpper: mint.tickUpper
    }))
  );

  return { flattenedBurns, flattenedMints };
}

// Set up the request headers
const headers = {
  'Accept': 'application/json',
  'X-REQUEST-TYPE': 'GraphQL',
  'Authorization': 'Bearer 944b560e76f53abf0739468966998887', // Replace with your actual Bearer token
  'Origin': 'https://thegraph.com',
  'Content-Type': 'application/json'
};

// Function to write data to CSV
async function writeDataToCSV(burnsData, mintsData) {
  // Convert the burns data to CSV
  const burnsCSV = parse(burnsData);
  fs.writeFileSync('burns.csv', burnsCSV);
  console.log('Burns data written to burns.csv');

  // Convert the mints data to CSV
  const mintsCSV = parse(mintsData);
  fs.writeFileSync('mints.csv', mintsCSV);
  console.log('Mints data written to mints.csv');
}

// Make the POST request to the GraphQL endpoint
const fetchData = async () => {
  const query = getQuery()
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query, variables })
  });

  // Ensure the response is successful
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const { data: { transactions } } = await response.json();
  // Filter burns and mints into separate arrays
  const { flattenedBurns, flattenedMints } = flattenBurnsAndMints(transactions);

  // Output the flattened results
  console.log("Flattened Burns:", flattenedBurns);
  console.log("Flattened Mints:", flattenedMints);
  writeDataToCSV(flattenedBurns, flattenedMints);
};

// Call the async function
fetchData();
