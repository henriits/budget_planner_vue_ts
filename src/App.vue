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
      <div class="balance-div">
        <BalanceComponent :total="+convertAmount(total)" :currencySymbol="selectedCurrency" />
      </div>
      <div class="income-expense-div">
        <IncomeExpenses :income="+convertAmount(income)" :expenses="+convertAmount(expenses)"
          :currencySymbol="selectedCurrency" />
      </div>
      <!-- Doughnut Chart -->
      <div v-if="!isCanvasEmpty" class="charts">
        <!-- Income and Expenses Chart -->
        <div class="chart-container">
          <DoughnutChart :chartData="incomeExpensesData" :isDarkMode="isDarkMode" />
        </div>
        <!-- Transactions by Categories Chart -->
        <div class="chart-container">
          <DoughnutChart :chartData="categoryData" :isDarkMode="isDarkMode" />
        </div>
        <!-- Other components and sections -->
      </div>
      <div class="history-container">
        <TransactionList :transactions="convertTransactions(transactions)"
          @transactionDeleted="handleTransactionDeleted" :currencySymbol="selectedCurrency" />
      </div>
      <!-- Add transaction section -->
      <div class="add-transaction-section">
        <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
      </div>
    </div>
  </div>
</template>

<script setup>
import DoughnutChart from "./components/DoughnutChart.vue"
import HeaderComponent from "./components/HeaderComponent.vue";
import BalanceComponent from "./components/BalanceComponent.vue";
import IncomeExpenses from "./components/IncomeExpenses.vue";
import TransactionList from "./components/TransactionList.vue";
import AddTransaction from "./components/AddTransaction.vue";
import { categoryColors } from "./categoryColors";
import { currencyRatios } from "./currencyRatios"

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
  // Retrieve the selected currency from local storage
  const savedCurrency = localStorage.getItem("selectedCurrency");
  if (savedCurrency && savedCurrency in currencyRatios) {
    selectedCurrency.value = savedCurrency;
  }
  const darkModePreference = localStorage.getItem('darkModePreference');
  if (darkModePreference !== null) {
    isDarkMode.value = JSON.parse(darkModePreference);
  }
});

const isCanvasEmpty = computed(() => {
  return transactions.value.length === 0;
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
    category: transactionData.category
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
  localStorage.setItem('darkModePreference', JSON.stringify(isDarkMode.value));

};



const selectedCurrency = ref(""); // Default selected currency symbol

const updateCurrencyRatio = (currency) => {
  selectedCurrency.value = currency;
  localStorage.setItem("selectedCurrency", currency);
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

const incomeExpensesData = computed(() => {
  return {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [income.value, expenses.value],
        backgroundColor: ["#00C853", "#FF5252"],
        hoverBackgroundColor: ["#00C853", "#FF5252"],
      },
    ],
  };
});


const categoryData = computed(() => {
  const categories = {};
  transactions.value.forEach((transaction) => {
    if (!categories[transaction.category]) {
      categories[transaction.category] = 0;
    }
    categories[transaction.category] += transaction.amount;
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);
  const backgroundColor = labels.map(category => categoryColors[category] || '#000000'); // Using specific colors for each category

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: backgroundColor,
      },
    ],
  };
});



</script>
