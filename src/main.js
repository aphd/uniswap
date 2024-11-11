const { fetchData } = require('./utils/fetch-data');
const { flattenBurnsAndMints } = require('./utils/flatten-object');
const { getQuery } = require('./utils/query');
const { writeDataToCSV } = require('./utils/write-data');

const main = async (startTime, endTime) => {
  const query = getQuery();
  const variables = { startTime, endTime };
  const { data: { transactions } } = await fetchData(query, variables);
  const { flattenedMints, flattenedBurns } = flattenBurnsAndMints(transactions);

  // Write in append mode
  writeDataToCSV(flattenedBurns, flattenedMints);
}

const loop = async () => {
  // Define the start and end date
  const startDate = '11-11-2024 01:00';  // Example start date
  const endDate = '11-11-2024 06:00';    // Example end date

  // Convert startDate and endDate to Unix time (timestamp)
  const startTime = new Date(startDate).getTime() / 1000; // Convert to Unix time (seconds)
  const endTime = new Date(endDate).getTime() / 1000;

  const interval = 60 * 5; // 5-minute interval

  // Loop over the time range, adding the interval until we reach endTime
  let currentStartTime = startTime;
  while (currentStartTime < endTime) {
    let currentEndTime = currentStartTime + interval;

    // Ensure that we don't exceed the endTime
    if (currentEndTime > endTime) {
      currentEndTime = endTime;
    }

    // Call the main function with the current interval
    console.log(currentStartTime, currentEndTime)
    await main(currentStartTime, currentEndTime);

    // Move the start time forward by the interval for the next loop
    currentStartTime = currentEndTime;
  }
}

// Run the loop function to start processing
loop();
