<template>
  <h3 v-if="transactions.length > 0">History</h3>
  <ul id="list" class="list" v-if="transactions.length > 0">
    <li v-for="transaction in transactions" :key="transaction.id" :class="transaction.amount < 0 ? 'minus' : 'plus'">
      <div>
        <span>{{ transaction.text }}</span>
        <span class="category-bubble">{{ transaction.category
          }}</span>
      </div>
      <span> {{ currencySymbol }}{{ transaction.amount }}</span>
      <button @click="deleteTransaction(transaction.id)" class="delete-btn">x</button>
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from "vue";

const emit = defineEmits(["transactionDeleted"]);

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

const deleteTransaction = (id) => {
  emit("transactionDeleted", id);
};
</script>
