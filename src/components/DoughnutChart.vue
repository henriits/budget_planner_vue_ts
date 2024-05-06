<template>
    <canvas ref="doughnutChartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps(['chartData', 'isDarkMode']);

const doughnutChartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
    if (doughnutChartCanvas.value) {
        renderChart();
    }
});

watch(() => [props.chartData, props.isDarkMode], ([chartData, isDarkMode], [prevChartData, prevIsDarkMode]) => {
    if (doughnutChartCanvas.value && (chartData !== prevChartData || isDarkMode !== prevIsDarkMode)) {
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
                    labels: {
                        color: props.isDarkMode ? 'rgba(252, 254, 254, 0.7)' : 'rgba(0,0,0)'
                    }
                },
                tooltip: {
                    enabled: true,
                },
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
