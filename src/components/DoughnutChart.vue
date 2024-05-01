<template>
    <canvas ref="doughnutChartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const doughnutChartCanvas = ref(null);

onMounted(() => {
    if (doughnutChartCanvas.value) {
        new Chart(doughnutChartCanvas.value, {
            type: 'doughnut',
            data: {
                labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
                datasets: [{
                    label: 'Dataset 1',
                    data: [23, 30, 30, 50, 20],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    hoverBackgroundColor: ['#FF1380', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true, // Hide the legend
                    },
                    tooltip: {
                        enabled: true // Disable tooltips
                    }
                }
            }
        });
    }
});
</script>