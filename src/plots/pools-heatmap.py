import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def plot_heatmap(volume_threshold, token_symbols=None):
    # Load the data from the CSV file
    df = pd.read_csv('pools.csv')

    # Create a new column for the token pair
    df['token_pair'] = df['token0_symbol'] + '/' + df['token1_symbol']

    # Filter the DataFrame for volumeUSD greater than the threshold
    df_filtered = df[df['volumeUSD'] > volume_threshold]

    # If a list of token symbols is provided, filter rows where any symbol is in token_pair
    if token_symbols:
        df_filtered = df_filtered[df_filtered['token_pair'].apply(
            lambda pair: any(symbol in pair for symbol in token_symbols)
        )]

    # Calculate APR and add it as a new column
    df_filtered['APR'] = (df_filtered['feesUSD'] * 365 / df_filtered['totalValueLockedUSD'])

    # Select relevant columns for the heatmap, including APR
    heatmap_data = df_filtered[['feeTier', 'token_pair', 'feesUSD', 'totalValueLockedUSD', 'volumeUSD', 'APR']]
    
    # Set the index to the token pairs
    heatmap_data.set_index('token_pair', inplace=True)

    # Convert data to numeric (if needed)
    heatmap_data = heatmap_data.apply(pd.to_numeric, errors='coerce')

    # Check if there's data to plot
    if heatmap_data.empty:
        print("No data available for the specified filters.")
        return

    # Define color maps for each metric
    color_maps = {
        'feeTier': 'Blues',
        'APR': 'Oranges',
        'feesUSD': 'Greens',
        'totalValueLockedUSD': 'Purples',
        'volumeUSD': 'Reds'
    }

    # Plot each metric with a dedicated color scale
    num_metrics = len(heatmap_data.columns)
    fig, axes = plt.subplots(1, num_metrics, figsize=(5 * num_metrics, 8), sharey=True)
    
    for i, metric in enumerate(heatmap_data.columns):
        sns.heatmap(
            heatmap_data[[metric]], 
            annot=True, 
            fmt=".2f", 
            cmap=color_maps[metric], 
            cbar_kws={'label': metric}, 
            ax=axes[i]
        )
        axes[i].set_title(f'Heatmap of {metric}')
        axes[i].set_xlabel('Token Pair' if i == 0 else '')
        axes[i].set_ylabel('' if i > 0 else 'Token Pair')

    plt.tight_layout()
    plt.show()

# Example usage:
plot_heatmap(100_000_000, token_symbols=['ETH', 'USD'])  # Adjust the threshold and token symbols as needed
