// Function to flatten and extract burns and mints from the transactions
const flattenBurnsAndMints = (transactions) => {
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

module.exports = {flattenBurnsAndMints}