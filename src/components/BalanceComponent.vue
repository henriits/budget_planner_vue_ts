<template>
  <h4>Your Balance</h4>
  <h1 id="balance">{{ currencySymbol }}{{ total }}</h1>
</template>

<script setup>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  currencySymbol: {
    type: String,
    required: true,
    default: "$" // Default currency symbol is $
  }
});
</script>
