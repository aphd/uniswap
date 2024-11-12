import pandas as pd
import matplotlib.pyplot as plt

def plot_fee_tiers(file_name, token0, token1):
    # Load the CSV file into a DataFrame
    df = pd.read_csv(file_name)
    
    # Filter the DataFrame for the specified token0 and token1 pair
    filtered_df = df[(df['token0'] == token0) & (df['token1'] == token1)]
    
    # Plot the histogram of the feeTier column
    plt.figure(figsize=(10, 6))
    plt.hist(filtered_df['feeTier'], bins=3, edgecolor='black', alpha=0.7)
    
    # Formatting the plot
    plt.xlabel('Fee Tier')
    plt.ylabel('Frequency')
    plt.title(f'Fee Tier Distribution for {token0}/{token1} Pair')
    plt.tight_layout()
    plt.show()

# Example usage
plot_fee_tiers('mints.csv', 'WETH', 'USDT')
