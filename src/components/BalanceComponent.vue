<template>
    <h4>Your Balance</h4>
    <h1 id="balance">{{ currencySymbol }}{{ total }}</h1>
</template>

<script setup lang="ts">
defineProps({
    total: {
        type: Number,
        required: true,
    },
    currencySymbol: {
        type: String,
        required: true,
        default: '$',
    },
});
</script>
