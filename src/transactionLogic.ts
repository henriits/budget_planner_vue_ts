import type { Ref } from 'vue';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

export interface Transaction {
    id: number;
    text: string;
    amount: number;
    category: string;
  }

const toast = useToast();
export const transactions: Ref<Transaction[]> = ref([]);

export const handleTransactionSubmitted = (transactionData: {
    id: number,
    text: string;
    amount: number;
    category: string;
}) => {
    const amount = transactionData.amount;
    if (isNaN(amount)) {
        toast.error('Please provide a valid amount for the transaction.');
        return;
    }
    transactions.value.push({
        id: generateUniqueId(),
        text: transactionData.text,
        amount: amount,
        category: transactionData.category,
    });
    saveTransactionsToLocalStorage();
    toast.success('Transaction added!');
};

export const handleTransactionDeleted = (id: number) => {
    transactions.value = transactions.value.filter(transaction => transaction.id !== id);
    saveTransactionsToLocalStorage();
    toast.success('Transaction deleted!');
};

export const saveTransactionsToLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions.value));
};

const generateUniqueId = (): number => {
    return Math.floor(Math.random() * 1000000);
};
