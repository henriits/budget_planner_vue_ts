<template>
  <h3 v-if="transactions.length > 0">History</h3>
  <ul id="list" class="list" v-if="transactions.length > 0">
    <li v-for="(transaction, index) in transactions" :key="transaction.id" :class="transaction.amount < 0 ? 'minus' : 'plus'">
      <div>
        <span v-if="!transaction.editing">{{ transaction.text }}</span>
        <input v-else v-model="transaction.text" @blur="saveEditedTransaction(index)" class="transaction-edit-input" />
        <span :style="{ backgroundColor: getCategoryColor(transaction.category) }" class="category-bubble">{{ transaction.category }}</span>
      </div>
      <span>{{ currencySymbol }}{{ transaction.amount }}</span>
      <div class="button-container">
        <button @click="toggleEdit(index)" class="edit-btn">{{ transaction.editing ? 'Save' : 'Edit' }}</button>
        <button @click="deleteTransaction(transaction.id)" class="delete-btn">x</button>
      </div>
    </li>
  </ul>
  <h3 v-else> No Transactions</h3>
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

const toggleEdit = (index) => {
  transactions[index].editing = !transactions[index].editing;
};

const saveEditedTransaction = (index) => {
  transactions[index].editing = false;
  // Save edited transaction to backend or emit an event to parent component to handle saving
  emit("transactionEdited", transactions[index]);
};
</script>

<style scoped>
.transaction-edit-input {
  font-size: 14px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-btn {
  font-size: 14px;
  padding: 6px 10px;
  margin-right: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  font-size: 14px;
  padding: 6px 10px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}

.button-container {
  display: flex;
}
</style>
