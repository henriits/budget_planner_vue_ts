<template>
  <h3 v-if="transactions.length > 0">History</h3>
  <ul id="list" class="list" v-if="transactions.length > 0">
    <li v-for="transaction in transactions" :key="transaction.id" :class="transaction.amount < 0 ? 'minus' : 'plus'">
      <div>
        <span>{{ transaction.text }}</span>
        <span :style="{ backgroundColor: getCategoryColor(transaction.category) }" class="category-bubble">{{
          transaction.category }}</span>

      </div>
      <span> {{ currencySymbol }}{{ transaction.amount }}</span>
      <button @click="deleteTransaction(transaction.id)" class="delete-btn">x</button>
    </li>
  </ul>
  <h3 v-else>No transactions found</h3>
</template>

<script setup>
import { categoryColors } from "../categoryColors";

const emit = defineEmits(["transactionDeleted"]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  currencySymbol: {
    type: String,
    required: true,
    default: "$" // Default currency symbol is $
  }
});



const getCategoryColor = (category) => {
  return categoryColors[category] || 'aqua'; // Default color is aqua if no match found
};


const deleteTransaction = (id) => {
  emit("transactionDeleted", id);
};
</script>
