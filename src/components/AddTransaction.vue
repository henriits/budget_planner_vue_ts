<template>
  <h3>Add new transaction</h3>
  <form id="form" @submit.prevent="onSubmit">
    <div class="form-control">
      <input
        type="text"
        id="text"
        v-model="text"
        placeholder="Enter Name (example : Salary)"
      />
    </div>
    <div class="form-control">
      <input
        type="text"
        id="amount"
        v-model="amount"
        placeholder="Enter amount (income, -expense) example: -100"
      />
    </div>
    <button class="btn">Add transaction</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";

const text = ref("");
const amount = ref("");
const emit = defineEmits(["transactionSubmitted"]);
const toast = useToast();

const onSubmit = () => {
  if (!text.value || !amount.value) {
    toast.error("Both fields must be filled!");
    return;
  }
  const transactionData = {
    text: text.value,
    amount: parseFloat(amount.value),
  };

  emit("transactionSubmitted", transactionData);
  text.value = "";
  amount.value = "";
};
</script>
