<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <div class="container">
      <div class="header">
        <HeaderComponent />
        <button @click="toggleDarkMode">
          <FontAwesomeIcon :icon="isDarkMode ? faSun : faMoon" /> {{ isDarkMode ? 'Light' : 'Dark' }}
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
import { currencyRatios } from "./currencyRatios";
import { computed, onMounted } from "vue";
import { transactions, handleTransactionSubmitted, handleTransactionDeleted} from "./transactionLogic";
import { isDarkMode, toggleDarkMode, loadDarkModePreference } from "./darkModeLogic";
import { selectedCurrency, updateCurrencyRatio, convertAmount, convertTransactions } from "./currencyLogic";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';



onMounted(() => {
  loadDarkModePreference();
  const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
  if (savedTransactions) {
    transactions.value = savedTransactions;
  }
  const savedCurrency = localStorage.getItem("selectedCurrency");
  if (savedCurrency && savedCurrency in currencyRatios) {
    selectedCurrency.value = savedCurrency;
  }
});

const isCanvasEmpty = computed(() => {
  return transactions.value.length === 0;
});

const total = computed(() => {
  return transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0).toFixed(2);
});

const income = computed(() => {
  return transactions.value.filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0).toFixed(2);
});

const expenses = computed(() => {
  return transactions.value.filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0).toFixed(2);
});

const incomeExpensesData = computed(() => {
  const convertedIncome = convertAmount(income.value);
  const convertedExpenses = convertAmount(expenses.value);

  return {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [convertedIncome, convertedExpenses],
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
    // Convert amount while retaining its sign (-amount)
    const convertedAmount = convertAmount(Math.abs(transaction.amount)) * Math.sign(transaction.amount);
    categories[transaction.category] += convertedAmount;
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
