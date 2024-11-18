const { fetchData } = require('./utils/fetch-data');
const { getSwap } = require('./utils/query');
const { writeCSV } = require('./utils/write-data');
const pools = {
    'USDC_WETH': '0x07a72f8f6a29cf501e7226ca82264f9ee79380e7',
    'USDC_HGOLD': '0x04708077eca6bb527a5bbbd6358ffb043a9c1c14',
    'mETH_WETH': '0x04708077eca6bb527a5bbbd6358ffb043a9c1c14'
}

const main = async () => {
    const pair = 'mETH_WETH';
    const query = getSwap(pools[pair]);
    const { data: { swaps } } = await fetchData(query, {});
    await writeCSV(swaps, `swaps-${pair}.csv`)
}

main();