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
      <!-- Doughnut Chart -->
      <div>
        <!-- Income and Expenses Chart -->
        <div class="chart-container">
          <DoughnutChart :chartData="incomeExpensesData" />
        </div>
        <!-- Transactions by Categories Chart -->
        <div class="chart-container">
          <DoughnutChart :chartData="categoryData" />
        </div>
        <!-- Other components and sections -->
      </div>
      <BalanceComponent :total="+convertAmount(total)" :currencySymbol="selectedCurrency" />
      <IncomeExpences :income="+convertAmount(income)" :expenses="+convertAmount(expenses)"
        :currencySymbol="selectedCurrency" />
      <TransactionList :transactions="convertTransactions(transactions)" @transactionDeleted="handleTransactionDeleted"
        :currencySymbol="selectedCurrency" />
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
  // Retrieve the selected currency from local storage
  const savedCurrency = localStorage.getItem("selectedCurrency");
  if (savedCurrency && savedCurrency in currencyRatios) {
    selectedCurrency.value = savedCurrency;
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
};

const currencyRatios = {
  "$": 1, // Default currency ratio is 1
  "€": 0.93, // Example: 1 USD = 0.93 EUR
  "£": 0.80, // Example: 1 USD = 0.80 GBP
  "¥": 155.98 // Example: 1 USD = 155.98 JPY
};

const selectedCurrency = ref("$"); // Default selected currency symbol

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
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
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
  const backgroundColor = generateRandomColors(labels.length);

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

const generateRandomColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  return colors;
};

</script>

<style>
.container {
  max-width: 900px;
  /* Set max width for large screens */
  margin: 0 auto;
  /* Center the container horizontally */
  padding: 20px;
  /* Add padding for better spacing */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 30px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 30px;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #b0a7a7;
}

.dark-mode .dropdown-content {
  background-color: #8a8787;
  color: white;
}

.chart-container {
  overflow-y: auto;
  /* Add vertical scrollbar if chart exceeds max height */
}

.main-content {
  display: flex;
  flex-wrap: wrap;


}

.balance-section,
.income-expenses-section,
.add-transaction-section {
  flex-basis: 100%;
  /* Full width */
}
</style>