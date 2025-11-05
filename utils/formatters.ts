export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string, decimals: number = 4): string => {
  return parseFloat(balance).toFixed(decimals);
};

export const formatUSD = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};