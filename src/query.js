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

module.exports = {getQuery};