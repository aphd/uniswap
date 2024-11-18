const { fetchData } = require('./utils/fetch-data');
const { flattenPools } = require('./utils/flatten-object');
const { getAPR_GQ } = require('./utils/query');
const { writeCSV } = require('./utils/write-data');

const main = async () => {
    const query = getAPR_GQ();
    const {data: {pools}} = await fetchData(query, {});
    const pools_and_apr = calculateApr(pools);
    await writeCSV(flattenPools(pools_and_apr), 'pools.csv')
}

const calculateApr = (data) => {
    return data.map(item => {
      // Parse feesUSD and totalValueLockedUSD to numbers
      const feesUSD = parseFloat(item.feesUSD);
      const totalValueLockedUSD = parseFloat(item.totalValueLockedUSD);
  
      // Calculate APR as feesUSD / totalValueLockedUSD
      const aprCalculated = (feesUSD * 365 / totalValueLockedUSD ) * 100;
  
      // Return the new object with the calculated APR
      return {
        ...item, // spread the original properties
        apr: aprCalculated.toString(), // convert the calculated APR back to a string
      };
    });
  };


main();