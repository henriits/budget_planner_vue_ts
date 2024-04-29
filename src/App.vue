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
            <a v-for="option in currencyOptions" :key="option" @click="updateCurrencySymbol(option)">{{ option }}</a>
          </div>
        </div>
      </div>
      <br>
      <BalanceComponent :total="+total" :currencySymbol="currencySymbol" />
      <IncomeExpences :income="+income" :expenses="+expenses" :currencySymbol="currencySymbol" />
      <TransactionList :transactions="transactions" @transactionDeleted="handleTransactionDeleted"
        :currencySymbol="currencySymbol" />
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

const currencySymbol = ref("€");

const currencyOptions = ["$", "€", "£", "¥"];

const updateCurrencySymbol = (newSymbol) => {
  currencySymbol.value = newSymbol;
};

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
