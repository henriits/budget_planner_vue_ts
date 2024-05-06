import type { Ref } from 'vue';
import { ref } from 'vue';
import { currencyRatios } from './currencyRatios';

export const selectedCurrency: Ref<string> = ref(''); // Default selected currency symbol

export const updateCurrencyRatio = (currency: string) => {
    selectedCurrency.value = currency;
    localStorage.setItem('selectedCurrency', currency);
};

export const convertAmount = (amount: number): string => {
    const ratio = currencyRatios[selectedCurrency.value];
    return (amount * ratio).toFixed(2);
};

export const convertTransactions = (transactions: { amount: number }[]): { amount: string }[] => {
    const ratio = currencyRatios[selectedCurrency.value];
    return transactions.map(transaction => ({
        ...transaction,
        amount: (transaction.amount * ratio).toFixed(2),
    }));
};
