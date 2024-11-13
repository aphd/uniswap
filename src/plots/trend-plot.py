import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

def plot_token_trends(file_name, token0, token1, max_tick_difference):
    # Load the CSV file into a DataFrame
    df = pd.read_csv(file_name)

    # Filter the DataFrame for the specified token0 and token1 pair
    filtered_df = df[(df['token0'] == token0) & (df['token1'] == token1)]

    # Exclude rows where the difference between tickUpper and tickLower is above the max_tick_difference
    filtered_df = filtered_df[abs(filtered_df['tickUpper'] - filtered_df['tickLower']) <= max_tick_difference]

    # Convert the timestamp to a human-readable datetime format
    filtered_df['timestamp'] = pd.to_datetime(filtered_df['timestamp'], unit='s')
    filtered_df['timestamp'] = filtered_df['timestamp'].dt.strftime('%d/%m/%Y %H:%M')

    # Plotting tickLower and tickUpper trends over time
    plt.figure(figsize=(12, 6))
    plt.plot(filtered_df['timestamp'], filtered_df['tickLower'], label='tickLower', marker='o', linestyle='-')
    plt.plot(filtered_df['timestamp'], filtered_df['tickUpper'], label='tickUpper', marker='o', linestyle='-')

    # Adding numerical values on the plot
    for i, value in enumerate(filtered_df['tickLower']):
        plt.text(filtered_df['timestamp'].iloc[i], value, str(value), fontsize=8, ha='center', va='bottom')
        
    for i, value in enumerate(filtered_df['tickUpper']):
        plt.text(filtered_df['timestamp'].iloc[i], value, str(value), fontsize=8, ha='center', va='bottom')

    # Formatting the plot
    plt.xlabel('Time (dd/mm/yyyy hh:mm)')
    plt.ylabel('Ticks')
    plt.title(f'Tick Lower and Upper Trends for {token0} - {token1}')
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()
    plt.show()

# Example usage:
plot_token_trends('mints.csv', 'USDC', 'WETH', 100)