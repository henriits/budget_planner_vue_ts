import type { Ref } from 'vue';
import { ref } from 'vue';
import { currencyRatios } from './currencyRatios';
import type { Transaction } from "./transactionLogic"
export const selectedCurrency: Ref<string> = ref('$'); // Default selected currency symbol

export const updateCurrencyRatio = (currency: string) => {
    selectedCurrency.value = currency;
    localStorage.setItem('selectedCurrency', currency);
};

export const convertAmount = (amount: number): number => {
    const ratio = currencyRatios[selectedCurrency.value];
    return parseFloat((amount * ratio).toFixed(2));
};

export function convertTransactions(transactions: { id: number; amount: number; category: string; text: string }[]): Transaction[] {
    return transactions.map(transaction => ({
      id: transaction.id,
      amount: convertAmount(transaction.amount),
      category: transaction.category,
      text: transaction.text  // Ensure 'text' is included as it's required in 'Transaction'
    }));
}
