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
    <button class="btn">Add transaction</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
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
  background-color: aqua;
  /* currenty added default color  need to make dynamicly changed*/

  border-radius: 10px;
  padding: 2px 8px;
  margin-left: 10px;
}
</style>
