const fs = require('fs');
const { parse } = require('json2csv');

// Function to write data to CSV in append mode with proper handling of headers
const writeDataToCSV = async (burnsData, mintsData) => {
    // Prepare the headers (same for both burns and mints)
    const header = ['id', 'timestamp', 'feeTier', 'poolId', 'token0', 'token1', 'tickLower', 'tickUpper'].join(',') + '\n';

    // Check if burns.csv exists, if not, write the header
    if (!fs.existsSync('burns.csv')) {
        fs.writeFileSync('burns.csv', header); // Write header for the first time
    }

    // Check if burnsData is empty before attempting to write
    if (burnsData && burnsData.length > 0) {
        const burnsCSV = parse(burnsData, { header: false }); // Do not add header in json2csv
        fs.appendFileSync('burns.csv', burnsCSV + '\n'); // Add a new line after appending
    } else {
        console.log('No burns data to write.');
    }

    // Check if mints.csv exists, if not, write the header
    if (!fs.existsSync('mints.csv')) {
        fs.writeFileSync('mints.csv', header); // Write header for the first time
    }

    // Check if mintsData is empty before attempting to write
    if (mintsData && mintsData.length > 0) {
        const mintsCSV = parse(mintsData, { header: false }); // Do not add header in json2csv
        fs.appendFileSync('mints.csv', mintsCSV + '\n'); // Add a new line after appending
    } else {
        console.log('No mints data to write.');
    }
}

module.exports = { writeDataToCSV }
