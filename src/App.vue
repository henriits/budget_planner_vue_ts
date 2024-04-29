<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <div class="container">
      <div class="header">
        <HeaderComponent />
        <button @click="toggleDarkMode">
          {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <!-- Dropdown menu for selecting currency -->
        <div class="dropdown">
          <button class="dropbtn">Select Currency</button>
          <div class="dropdown-content">
            <a v-for="(ratio, currency) in currencyRatios" :key="currency" @click="updateCurrencyRatio(currency)">{{
              currency }}</a>
          </div>
        </div>
      </div>
      <br>
      <!-- Display total balance, income, expenses, and transactions in selected currency -->
      <BalanceComponent :total="+convertAmount(total)" :currencySymbol="selectedCurrency" />
      <IncomeExpences :income="+convertAmount(income)" :expenses="+convertAmount(expenses)"
        :currencySymbol="selectedCurrency" />
      <TransactionList :transactions="convertTransactions(transactions)" @transactionDeleted="handleTransactionDeleted"
        :currencySymbol="selectedCurrency" />
      <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
    </div>
  </div>
</template>

<script setup>
import HeaderComponent from "./components/HeaderComponent.vue";
import BalanceComponent from "./components/BalanceComponent.vue";
import IncomeExpences from "./components/IncomeExpences.vue";
import TransactionList from "./components/TransactionList.vue";
import AddTransaction from "./components/AddTransaction.vue";

import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const transactions = ref([]);
const isDarkMode = ref(false);

onMounted(() => {
  const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
  if (savedTransactions) {
    transactions.value = savedTransactions;
  }
});

const total = computed(() => {
  return transactions.value
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2);
});
const income = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2);
});
const expenses = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2);
});

const handleTransactionSubmitted = (transactionData) => {
  const amount = parseFloat(transactionData.amount);
  if (isNaN(amount)) {
    toast.error('Please provide a valid amount for the transaction.');
    return;
  }
  transactions.value.push({
    id: generateUniqueId(),
    text: transactionData.text,
    amount: transactionData.amount,
  });
  saveTransactionsToLocalStorage();
  toast.success("Transaction added!");
};

const generateUniqueId = () => {
  return Math.floor(Math.random() * 1000000);
};

const handleTransactionDeleted = (id) => {
  transactions.value = transactions.value.filter((transaction) => transaction.id !== id);
  saveTransactionsToLocalStorage();
  toast.success("Transaction deleted!");
};

const saveTransactionsToLocalStorage = () =>
  localStorage.setItem("transactions", JSON.stringify(transactions.value));

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

const currencyRatios = {
  "$": 1, // Default currency ratio is 1
  "€": 0.85, // Example: 1 USD = 0.85 EUR
  "£": 0.75, // Example: 1 USD = 0.75 GBP
  "¥": 110.27 // Example: 1 USD = 110.27 JPY
};

const selectedCurrency = ref("$"); // Default selected currency symbol

const updateCurrencyRatio = (currency) => {
  selectedCurrency.value = currency;
};

const convertAmount = (amount) => {
  const ratio = currencyRatios[selectedCurrency.value];
  return (amount * ratio).toFixed(2);
};

const convertTransactions = (transactions) => {
  const ratio = currencyRatios[selectedCurrency.value];
  return transactions.map(transaction => ({
    ...transaction,
    amount: (transaction.amount * ratio).toFixed(2)
  }));
};

</script>

<style>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h2 {
  margin: 0;
}

/* Dropdown button style */
.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 30px;
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 30px;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Dropdown links */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #b0a7a7;
}

/* Dark mode */
.dark-mode .dropdown-content {
  background-color: #8a8787;
  color: white;
}
</style>
