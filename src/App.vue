<template>
  <HeaderComponent />
  <div class="container">
    <BalanceComponent :total="total" />
    <IncomeExpences :income="income" :expenses="expenses" />
    <TransactionList :transactions="transactions" />
    <AddTransaction />
  </div>
</template>

<script setup>
import HeaderComponent from "./components/HeaderComponent.vue";
import BalanceComponent from "./components/BalanceComponent.vue";
import IncomeExpences from "./components/IncomeExpences.vue";
import TransactionList from "./components/TransactionList.vue";
import AddTransaction from "./components/AddTransaction.vue";

import { ref, computed } from "vue";

const transactions = ref([
  {
    id: 1,
    text: "flower",
    amount: -192.99,
  },
  {
    id: 2,
    text: "Salary",
    amount: 3009.99,
  },
  {
    id: 3,
    text: "book",
    amount: -9.99,
  },
  {
    id: 4,
    text: "Macbook",
    amount: -2339.99,
  },
]);

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
</script>
