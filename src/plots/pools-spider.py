import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import random

def plot_spider_chart(file_name='pools.csv', tokens_to_display=None):
    # Load the CSV data
    df = pd.read_csv(file_name)

    # Filter the data for the token pairs of interest
    if tokens_to_display:
        tokens_to_display = [tuple(pair) for pair in tokens_to_display]  # Ensure pairs are tuples
        df = df[
            df.apply(
                lambda row: (row['token0_symbol'], row['token1_symbol']) in tokens_to_display or
                            (row['token1_symbol'], row['token0_symbol']) in tokens_to_display,
                axis=1
            )
        ]

    # Remove any rows where the relevant columns are missing
    df = df.dropna(subset=['feeTier', 'feesUSD', 'totalValueLockedUSD'])

    # Define metrics and their scales
    metrics = ['feeTier', 'feesUSD', 'totalValueLockedUSD']
    metric_ranges = {metric: (df[metric].min(), df[metric].max()) for metric in metrics}

    # Normalize the metrics for plotting
    normalized_data = {
        metric: (df[metric] - metric_ranges[metric][0]) / (metric_ranges[metric][1] - metric_ranges[metric][0])
        for metric in metrics
    }

    # Prepare data for each token pair
    token_pairs = df.apply(lambda row: f"{row['token0_symbol']}/{row['token1_symbol']}", axis=1)
    token_data = {}

    for pair in token_pairs.unique():
        filtered = df[token_pairs == pair]
        token_data[pair] = [
            normalized_data['feeTier'][filtered.index].mean(),
            normalized_data['feesUSD'][filtered.index].mean(),
            normalized_data['totalValueLockedUSD'][filtered.index].mean()
        ]

    # Create the angles for the spider chart
    labels = metrics
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]  # Closing the circle

    # Create the figure and axis
    fig, ax = plt.subplots(figsize=(8, 8), dpi=100, subplot_kw=dict(polar=True))

    # Generate random colors for each token pair
    random.seed(42)  # For reproducibility
    colors = [f"#{random.randint(0, 0xFFFFFF):06x}" for _ in token_pairs.unique()]

    # Plot the data for each token pair
    for i, (pair, values) in enumerate(token_data.items()):
        values += values[:1]  # Closing the circle
        ax.plot(angles, values, label=pair, color=colors[i], linewidth=2)
        ax.fill(angles, values, color=colors[i], alpha=0.25)

    # Set up labels and scales for each axis
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)

    for i, metric in enumerate(labels):
        min_val, max_val = metric_ranges[metric]
        ticks = np.linspace(min_val, max_val, num=5)
        tick_angles = [angles[i]] * len(ticks)
        for tick_angle, tick_val in zip(tick_angles, ticks):
            ax.text(tick_angle, tick_val / max_val, f"{tick_val:.2f}", horizontalalignment="center", verticalalignment="bottom", fontsize=8)

    # Add a grid for better visualization
    ax.yaxis.grid(True, linestyle='--', color='gray', alpha=0.7)

    # Add a legend
    ax.legend(loc='upper right', bbox_to_anchor=(1.5, 1.1), title="Token Pairs")

    # Title
    ax.set_title('Spider Chart of Pool Metrics', va='bottom')

    # Show the plot
    plt.tight_layout()
    plt.show()

# Example usage
tokens = [['EURT', 'USDT'], ['CEL', 'WETH']]  # Add token pairs you want to display
plot_spider_chart(file_name='pools.csv', tokens_to_display=tokens)
