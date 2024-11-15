import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from math import pi

def plot_spider(csv_file):
    # Load the data from the CSV file
    df = pd.read_csv(csv_file)

    # Define the categories
    categories = ['fee', 'TVL', 'APR', '1DVol', '30DVol', '1DvolTVL']
    
    # Prepare the data for plotting
    values = df[categories[:-1]].values  # Exclude '1DvolTVL' for now

    # Convert the values to numeric, handling 'M' and 'B' suffixes
    converted_values = []
    for row in values:
        converted_row = []
        for v in row:
            if isinstance(v, str) and 'M' in v:
                converted_row.append(float(v.replace('M', '').replace(',', '')) * 1e6)
            elif isinstance(v, str) and 'B' in v:
                converted_row.append(float(v.replace('B', '').replace(',', '')) * 1e9)
            else:
                converted_row.append(float(v))  # Directly convert to float if it's already numeric
        converted_values.append(converted_row)
    
    converted_values = np.array(converted_values)

    # Compute 1DvolTVL as 1DVol / TVL
    # Ensure TVL is not zero to avoid division by zero
    tvl_values = converted_values[:, 1]  # TVL is the second column
    one_d_vol_values = converted_values[:, 3]  # 1DVol is the fourth column
    one_d_vol_tvl = np.divide(one_d_vol_values, tvl_values, out=np.zeros_like(one_d_vol_values), where=tvl_values!=0)

    # Add the computed 1DvolTVL to the converted values
    converted_values = np.column_stack((converted_values, one_d_vol_tvl))

    # Normalize values based on the max for each category
    max_values = converted_values.max(axis=0)
    normalized_values = converted_values / max_values

    # Number of variables
    num_vars = len(categories)

    # Compute angle for each axis
    angles = [n / float(num_vars) * 2 * pi for n in range(num_vars)]
    angles += angles[:1]  # Complete the loop

    # Create the spider plot
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

    # Add each token's data to the plot
    for index, row in df.iterrows():
        values_row = normalized_values[index].tolist()
        values_row += values_row[:1]  # Complete the loop
        ax.fill(angles, values_row, alpha=0.25, label=f"{row['token0']}/{row['token1']}")
        ax.plot(angles, values_row, linewidth=2)  # Line around the area

    # Labels for each axis
    plt.xticks(angles[:-1], categories, color='grey', size=12)
    
    # Add title and legend
    plt.title('Spider Plot of Tokens', size=15, color='black', weight='bold')
    plt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))

    # Display max values on the plot
    for i, angle in enumerate(angles[:-1]):
        ax.text(angle, 1.05, f"{max_values[i]:,.0f}", horizontalalignment='center', size=12, color='black')

    # Show the plot
    plt.show()

# Example usage
plot_spider('uniswap_pools.csv')