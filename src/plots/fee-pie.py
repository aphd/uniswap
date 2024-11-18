import pandas as pd
import matplotlib.pyplot as plt

def plot_fee_tiers_pie(file_name, token0, token1):
    # Load the CSV file into a DataFrame
    df = pd.read_csv(file_name)
    
    # Filter the DataFrame for the specified token0 and token1 pair
    filtered_df = df[(df['token0'] == token0) & (df['token1'] == token1)]
    
    # Get the feeTier counts for the filtered data
    fee_tier_counts = filtered_df['feeTier'].value_counts()
    
    # Plot the pie chart
    plt.figure(figsize=(8, 8))
    plt.pie(fee_tier_counts, labels=fee_tier_counts.index, autopct='%1.1f%%', startangle=90, colors=plt.cm.Paired.colors)
    
    # Formatting the plot
    plt.title(f'Fee Tier Distribution for {token0}/{token1} Pair')
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
    plt.tight_layout()
    plt.show()

# Example usage
plot_fee_tiers_pie('mints.csv', 'WETH', 'USDT')
