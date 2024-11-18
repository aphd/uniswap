import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

# Load the data from the CSV file
df = pd.read_csv('swaps-USDC_HGOLD.csv')

# Convert the timestamp to human-readable format
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')

# Calculate cumulative sums
df['cumulative_amount0'] = df['amount0'].cumsum()
df['cumulative_amount1'] = df['amount1'].cumsum()

# Create a figure and axis
plt.figure(figsize=(12, 6))

# Plot cumulative amount0 and amount1
plt.plot(df['timestamp'], df['cumulative_amount0'], label='Cumulative Amount 0', color='blue', marker='o')
# plt.plot(df['timestamp'], df['cumulative_amount1'], label='Cumulative Amount 1', color='red', marker='o')

# Formatting the x-axis
plt.xlabel('Timestamp (dd/mm/yyyy hh:mm)')
plt.ylabel('Cumulative Amount')
plt.title('Cumulative Trend Plot of Amount 0 and Amount 1 Over Time')
plt.xticks(rotation=45)  # Rotate x-axis labels for better readability
plt.legend()
plt.grid()

# Show the plot
plt.tight_layout()
plt.show()