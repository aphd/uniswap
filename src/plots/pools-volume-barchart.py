import pandas as pd
import matplotlib.pyplot as plt

def plot_volume_bar_chart(csv_file, filter_tokens=None, volume_threshold=0):
    # Load the data from the CSV file
    df = pd.read_csv(csv_file)
    
    # Create a new column for the token pair
    df['token_pair'] = df['token0_symbol'] + '/' + df['token1_symbol']
    
    # Filter by specified substrings in the token pair if provided
    if filter_tokens:
        df = df[df['token_pair'].apply(lambda x: any(ft in x for ft in filter_tokens))]
    
    # Filter out pairs with volumeUSD below the threshold
    df = df[df['volumeUSD'] > volume_threshold]
    
    # Plot the bar chart for volumeUSD by token pair
    plt.figure(figsize=(12, 6))
    plt.bar(df['token_pair'], df['volumeUSD'], color='skyblue')
    plt.xlabel('Token Pair')
    plt.ylabel('Volume (USD)')
    plt.title('Trading Volume for Each Token Pair')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.show()

# Example usage:
plot_volume_bar_chart('../data/pools.csv', filter_tokens=['USD', 'ETH', 'EUR', 'BTC'], volume_threshold=100_000_000)
