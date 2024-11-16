const fs = require('fs');

// Funzione per convertire le abbreviazioni (M = milioni, B = miliardi)
const convertToNumber = (value) => {
  const multiplier = value.slice(-1);
  const num = parseFloat(value.slice(0, -1));

  if (multiplier === 'M') return num * 1e6;
  if (multiplier === 'B') return num * 1e9;

  return num;
};

// Funzione per calcolare l'APR basato su 1DVol
const calculateAPR1DVol = (fee, TVL, _1DVol) => {
  const dailyFeeIncome = (_1DVol * fee) / 1;
  const annualFeeIncome = dailyFeeIncome * 365;
  return (annualFeeIncome / TVL);
};

// Funzione per calcolare l'APR basato su 30DVol
const calculateAPR30DVol = (fee, TVL, _30DVol) => {
  const dailyFeeIncome = (_30DVol * fee) / 30;
  const annualFeeIncome = dailyFeeIncome * 365;
  return (annualFeeIncome / TVL);
};

// Funzione per calcolare 1DVol/TVL
const calculate1DVolToTVL = (_1DVol, TVL) => _1DVol / TVL;

// Funzione per leggere e processare il file CSV
const parseCSV = async (filePath) => {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  const rows = data.split('\n').map(row => row.split(','));

  // Ignora la prima riga (header)
  const header = rows.shift();

  // Elaborazione delle righe
  const results = rows.map(row => {
    const [token0, token1, fee, TVL, _1DVol, _30DVol] = row;

    if (!token0 || !token1) return; // Salta le righe vuote

    // Conversione dei valori
    const feeValue = parseFloat(fee);
    const TVLValue = convertToNumber(TVL);
    const _1DVolValue = convertToNumber(_1DVol);
    const _30DVolValue = convertToNumber(_30DVol);

    // Calcolo dell'APR e del rapporto 1DVol/TVL
    const APR1DVol = (calculateAPR1DVol(feeValue, TVLValue, _1DVolValue) * 1).toFixed(2); // Moltiplicato per 100 per ottenere la percentuale
    const APR30DVol = (calculateAPR30DVol(feeValue, TVLValue, _30DVolValue) * 1).toFixed(2); // Moltiplicato per 100 per ottenere la percentuale
    const _1DVolToTVL = calculate1DVolToTVL(_1DVolValue, TVLValue).toFixed(6);

    return { pair: `${token0}-${token1}`, fee, TVL, _1DVol, _30DVol, APR1DVol, APR30DVol, _1DVolToTVL };
  });

  return results.filter(row => row !== undefined);
};

// Funzione per generare la tabella LaTeX
const generateLatexTable = (data) => {
  let table = `
\\begin{table*}[h!]
\\centering
\\begin{tabular}{|c|r|r|r|r|r|r|r|}
\\hline
\\textbf{Pair} & \\textbf{Fee (\\%)} & \\textbf{TVL} & \\textbf{1DVol} & \\textbf{30DVol} & \\textbf{APR (1DVol) (\\%)} & \\textbf{APR (30DVol) (\\%)} & \\textbf{1DVol/TVL} \\\\ 
\\hline
`;

  data.forEach(row => {
    // Aggiungi il simbolo "%" alle colonne APR e escape il simbolo di percentuale
    table += `
${row.pair} & ${row.fee} & ${row.TVL} USD & ${row._1DVol} USD & ${row._30DVol} USD & ${row.APR1DVol} & ${row.APR30DVol} & ${row._1DVolToTVL} \\\\ 
`;
  });

  table += `
\\hline
\\end{tabular}
\\caption{Uniswap Pools APR and 1DVol/TVL Ratios}
\\end{table*}
`;

  return table;
};

// Funzione principale per eseguire lo script
const main = async () => {
  try {
    const filePath = 'uniswap_pools.csv'; // Percorso al file CSV
    const data = await parseCSV(filePath);
    const latexTable = generateLatexTable(data);
    console.log('LaTeX Output:\n');
    console.log(latexTable);
  } catch (error) {
    console.error('Errore durante il processamento del file CSV:', error);
  }
};

// Esegui la funzione principale
main();
