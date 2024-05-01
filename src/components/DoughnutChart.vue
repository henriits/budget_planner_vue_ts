<template>
    <canvas ref="doughnutChartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps(['chartData']);

const doughnutChartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
    if (doughnutChartCanvas.value) {
        renderChart();
    }
});

watch(() => props.chartData, () => {
    if (doughnutChartCanvas.value) {
        destroyChart(); // Destroy existing chart before rendering new one
        renderChart();
    }
});

const renderChart = () => {
    chartInstance = new Chart(doughnutChartCanvas.value, {
        type: 'doughnut',
        data: props.chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
};

const destroyChart = () => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
};
</script>