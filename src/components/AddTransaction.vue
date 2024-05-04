<template>
  <h3>Add new transaction</h3>
  <form id="form" @submit.prevent="onSubmit">
    <div class="form-control">
      <input type="text" id="text" v-model="text" placeholder="Enter Name (example : Salary)" />
    </div>
    <div class="form-control">
      <input type="text" id="amount" v-model="amount" placeholder="Enter amount (income, -expense) example: -100" />
    </div>
    <div class="form-control">
      <select v-model="selectedCategory" @change="changeCategoryColor">
        <option value="">Select Category</option>
        <option v-for="category in categories" :key="category" :style="{ color: categoryColors[category] }">{{ category
          }}</option>
      </select>
    </div>
    <button class="form-button">Add transaction</button>
  </form>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useToast } from "vue-toastification";
import { categoryColors } from "../categoryColors";

const text = ref("");
const amount = ref("");
const selectedCategory = ref("");
const emit = defineEmits(["transactionSubmitted"]);
const toast = useToast();

const categories = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Others",
  "Income"
];

const onSubmit = () => {
  if (!text.value || !amount.value || !selectedCategory.value) {
    toast.error("All fields must be filled!");
    return;
  }
  const transactionData = {
    text: text.value,
    amount: parseFloat(amount.value),
    category: selectedCategory.value,
    categoryColor: categoryColors[selectedCategory.value] // Pass category color
  };

  emit("transactionSubmitted", transactionData);
  text.value = "";
  amount.value = "";
  selectedCategory.value = "";
};
</script>

<style>
.category-bubble {
  border-radius: 8px;
  padding: 1px 6px;
  margin-left: 5px;
  font-size: 12px;
  color: rgb(252, 252, 252);
}

.form-control {
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .form-control {
    width: calc(50% - 10px);
    display: inline-block;
    margin-bottom: 20px;
  }
}

input[type="text"],
select {
  width: calc(100% - 10px);
  height: 40px;
  padding: 5px;
  border-radius: 4px;
  box-sizing: border-box;
  color: black;
}

.form-button {
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  height: 40px;
}
</style>
