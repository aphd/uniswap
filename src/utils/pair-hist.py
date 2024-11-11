import pandas as pd
import matplotlib.pyplot as plt
from collections import Counter

def plot_token_pairs(filename, min_occurrences):
    # Read the CSV file using pandas
    df = pd.read_csv(filename)

    # Extract the token0 and token1 columns and combine them into a list of pairs
    token_pairs = list(zip(df['token0'], df['token1']))

    # Count the frequency of each token pair using Counter
    pair_counts = Counter(token_pairs)

    # Filter pairs that have occurrences >= min_occurrences
    filtered_pairs = {pair: count for pair, count in pair_counts.items() if count >= min_occurrences}

    # Print the filtered pair counts
    for pair, count in filtered_pairs.items():
        print(f'{pair}: {count}')

    # Plot the histogram of token pair frequencies
    pairs, counts = zip(*filtered_pairs.items())
    plt.bar([str(pair) for pair in pairs], counts)
    plt.xlabel('Token Pair (token0, token1)')
    plt.ylabel('Frequency')
    plt.title(f'Frequency of Token Pairs (Occurrences >= {min_occurrences})')
    plt.xticks(rotation=90)
    plt.tight_layout()
    plt.show()

# Example usage: Plot token pairs with occurrences >= 5
plot_token_pairs('burns.csv', 5)
