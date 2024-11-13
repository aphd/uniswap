// Define the GraphQL query

const getQuery = () => `
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

const getMintsGQ = () => `
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
    }
  }
`;

const getAPR_GQ = () => `query {
  pools(first: 1000) {
    id
    feeTier
    token0 {
      id
      symbol
    }
    token1 {
      id
      symbol
    }
    totalValueLockedUSD
    volumeUSD
    feesUSD
  }
}`;

const getSwap = (pool_id) => `query {
  swaps(first: 1000, where: { 
    timestamp_gte: 1693526400,
    pool: "${pool_id}"
  }, orderBy: timestamp, orderDirection: asc) {
    amount0
    amount1
    timestamp
  }
}`;

module.exports = { getMintsGQ, getQuery, getAPR_GQ, getSwap };