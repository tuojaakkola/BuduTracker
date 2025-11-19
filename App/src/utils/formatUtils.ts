// Format number as currency string with comma as decimal separator
export function formatCurrency(amount: number, decimals: number = 2): string {
  return amount.toFixed(decimals).replace('.', ',');
}

// Convert a string with comma as decimal separator to a number
export function parseLocaleCurrency(value: string): number {
  return parseFloat(value.replace(',', '.'));
}
