import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def plot_heatmap(volume_threshold):
    # Load the data from the CSV file
    df = pd.read_csv('pools.csv')

    # Create a new column for the token pair
    df['token_pair'] = df['token0_symbol'] + '/' + df['token1_symbol']

    # Filter the DataFrame for volumeUSD greater than the threshold
    df_filtered = df[df['volumeUSD'] > volume_threshold]

    # Select relevant columns for the heatmap
    heatmap_data = df_filtered[['token_pair', 'apr', 'feesUSD', 'totalValueLockedUSD', 'volumeUSD']]

    # Set the index to the token pairs
    heatmap_data.set_index('token_pair', inplace=True)

    # Convert data to numeric (if needed)
    heatmap_data = heatmap_data.apply(pd.to_numeric, errors='coerce')

    # Check if there's data to plot
    if heatmap_data.empty:
        print("No data available for the specified volume threshold.")
        return

    # Create the heatmap
    plt.figure(figsize=(12, 8))
    sns.heatmap(heatmap_data, annot=True, fmt=".2f", cmap='viridis', cbar_kws={'label': 'Value'})
    plt.title('Heatmap of Token Pools')
    plt.xlabel('Metrics')
    plt.ylabel('Token Pair')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# Example usage:
plot_heatmap(100_000_000)  # Adjust the threshold as needed