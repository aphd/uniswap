const fs = require('fs');
const { parse } = require('json2csv');

const endpoint = 'https://gateway.thegraph.com/api/deployments/id/QmTZ8ejXJxRo7vDBS4uwqBeGoxLSWbhaA7oXa1RvxunLy7';  // Replace with your actual GraphQL endpoint

// Define the GraphQL query
const query = `
  query ($startTime: Int!, $endTime: Int!) {
    transactions(where: { 
      timestamp_gte: $startTime, 
      timestamp_lte: $endTime 
    }) {
      id
      timestamp
      mints(where: { pool_not: null }) {
        pool {
          id
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          feeTier
        }
        tickLower
        tickUpper
      }
      burns(where: { pool_not: null }) {
        pool {
          id
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          feeTier
        }
        tickLower
        tickUpper
      }
    }
  }
`;

// Set the variables for the query
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
  try {
    // Convert the burns data to CSV
    const burnsCSV = parse(burnsData);
    fs.writeFileSync('burns.csv', burnsCSV);
    console.log('Burns data written to burns.csv');

    // Convert the mints data to CSV
    const mintsCSV = parse(mintsData);
    fs.writeFileSync('mints.csv', mintsCSV);
    console.log('Mints data written to mints.csv');
  } catch (error) {
    console.error('Error writing data to CSV:', error);
  }
}

// Make the POST request to the GraphQL endpoint
const fetchData = async () => {
  try {
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
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Call the async function
fetchData();
