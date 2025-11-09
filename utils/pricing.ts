// mock price for all tokens until you add CoinGecko
export const getUsdValue = (ethAmount: number) => {
  const price = 2000; // use same mock everywhere
  return ethAmount * price;
};
