<template>
    <h3>Add new transaction</h3>
    <h5>NB! For income write <u>positive</u> amount, for expense <u>negative</u> amount!</h5>
    <form id="form" @submit.prevent="onSubmit">
        <div class="form-control">
            <input
                type="text"
                id="text"
                name="text"
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
        <div class="form-control">
            <select
                v-model="selectedCategory"
                id="category"
                name="category"
                aria-label="Select Category"
            >
                <option value="">Select Category</option>
                <option
                    v-for="category in categories"
                    :key="category"
                >
                    {{ category }}
                </option>
            </select>
        </div>
        <div class="form-control">
            <select
                v-model="selectedCurrency"
                id="currency"
                name="currency"
                aria-label="Select Currency"
            >
                <option value="">Select Currency</option>
                <option v-for="currency in Object.keys(currencyRatios)" :key="currency">
                    {{ currency }}
                </option>
            </select>
        </div>
        <button class="form-button">Add transaction</button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { currencyRatios } from '../helperFunctions/currencyRatios';
import { categoryColors } from '../helperFunctions/categoryColors';
import { categories } from '../helperFunctions/categoryList';

const text = ref('');
const amount = ref('');
const selectedCategory = ref('');
const selectedCurrency = ref('');
const emit = defineEmits(['transactionSubmitted']);
const toast = useToast();



const onSubmit = () => {
    if (!text.value || !amount.value || !selectedCategory.value || !selectedCurrency.value) {
        toast.error('All fields must be filled!');
        return;
    }

    const ratio = currencyRatios[selectedCurrency.value];
    if (!ratio) {
        toast.error('Invalid currency ratio selected!');
        return;
    }

    const parsedAmount = parseFloat(amount.value);
    if (isNaN(parsedAmount)) {
        toast.error('Please enter a valid amount!');
        return;
    }

    const convertedAmount = parsedAmount / ratio;

    const transactionData = {
        text: text.value,
        amount: convertedAmount,
        category: selectedCategory.value,
        categoryColor: categoryColors[selectedCategory.value],
    };

    emit('transactionSubmitted', transactionData);
    text.value = '';
    amount.value = '';
    selectedCategory.value = '';
};
</script>
