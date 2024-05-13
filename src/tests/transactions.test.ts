import { beforeEach, describe, expect, it } from 'vitest';
import {
    selectedCurrency,
    updateCurrencyRatio,
    convertAmount,
    convertTransactions,
} from '../currencyLogic';
import { currencyRatios } from '../currencyRatios';
import {
    transactions,
    handleTransactionSubmitted,
    handleTransactionDeleted,
    saveTransactionsToLocalStorage,
} from '../transactionLogic';

interface Transaction {
    id: number;
    text: string;
    amount: number;
    category: string;
}

describe('Currency Logic', () => {
    beforeEach(() => {
        selectedCurrency.value = '$';
    });

    describe('Update Currency', () => {
        it('should update selected currency', () => {
            const newCurrency: string = '¤';
            updateCurrencyRatio(newCurrency);
            expect(selectedCurrency.value).toBe(newCurrency);
        });

        it('should update the selected currency in local storage when a valid currency is provided', () => {
            const newCurrency: string = '/';
            updateCurrencyRatio(newCurrency);
            expect(localStorage.getItem('selectedCurrency')).toBe(newCurrency);
        });
    });

    describe('Convert Amount', () => {
        it('should convert amount correctly', () => {
            const amount: number = 100;
            const ratio: number = currencyRatios[selectedCurrency.value];
            const expectedConvertedAmount: number = amount * ratio;
            expect(convertAmount(amount)).toBe(expectedConvertedAmount);
        });

        it('should return zero when converting zero amount', () => {
            expect(convertAmount(0)).toBe(0.0);
        });
    });
});

describe('Transaction Logic', () => {
    beforeEach(() => {
        transactions.value = [];
    });

    describe('Converting Transactions', () => {
        it('should handle empty transactions array', () => {
            const transactions: Transaction[] = [];
            expect(convertTransactions(transactions)).toEqual([]);
        });
    });

    describe('Handling Transaction Operations', () => {
        it('should handle transaction submission', () => {
            const transactionData: Transaction = {
                id: 1,
                text: 'Groceries',
                amount: 50,
                category: 'Food',
            };
            handleTransactionSubmitted(transactionData);
            expect(transactions.value.length).toBe(1);
        });

        it('should handle transaction deletion', () => {
            transactions.value = [
                { id: 1, text: 'Groceries', amount: 50, category: 'Food' },
                { id: 2, text: 'Fuel', amount: 30, category: 'Transport' },
            ];
            handleTransactionDeleted(1);
            expect(transactions.value.length).toBe(1);
            expect(transactions.value[0].id).toBe(2);
        });

        it('should handle transaction deletion of non-existent transaction', () => {
            transactions.value = [{ id: 1, text: 'Groceries', amount: 50, category: 'Food' }];
            handleTransactionDeleted(2);
            expect(transactions.value.length).toBe(1);
        });

        it('should save transactions to local storage', () => {
            const transactionData: Transaction = {
                id: 1,
                text: 'Groceries',
                amount: 50,
                category: 'Food',
            };
            handleTransactionSubmitted(transactionData);
            saveTransactionsToLocalStorage();
            const storedTransactions = JSON.parse(
                localStorage.getItem('transactions') || '[]',
            ) as Transaction[];
            expect(storedTransactions[0].text).toBe('Groceries');
            expect(storedTransactions[0].amount).toBe(50);
        });

        it('should add transaction with negative amounts', () => {
            const transactionData: Transaction = {
                id: 1,
                text: 'Groceries',
                amount: -50,
                category: 'Food',
            };
            handleTransactionSubmitted(transactionData);
            expect(transactions.value.length).toBe(1);
        });

        it('should not add transaction with invalid amount', () => {
            const transactionData: Transaction = {
                id: 1,
                text: 'Groceries',
                amount: NaN,
                category: 'Food',
            };
            handleTransactionSubmitted(transactionData);
            expect(transactions.value.length).toBe(0);
        });
    });
});
