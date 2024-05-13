<template>
    <canvas ref="doughnutChartCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        label: string;
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }[];
}

const props = defineProps<{
    chartData: ChartData;
    isDarkMode: boolean;
}>();
const doughnutChartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'doughnut'> | null = null;

onMounted(() => {
    if (doughnutChartCanvas.value) {
        renderChart();
    }
});

watch(
    () => [props.chartData, props.isDarkMode],
    ([chartData, isDarkMode], [prevChartData, prevIsDarkMode]) => {
        if (
            doughnutChartCanvas.value &&
            (chartData !== prevChartData || isDarkMode !== prevIsDarkMode)
        ) {
            destroyChart(); // Destroy existing chart before rendering new one
            renderChart();
        }
    },
);

const renderChart = () => {
    chartInstance = new Chart(doughnutChartCanvas.value as HTMLCanvasElement, {
        type: 'doughnut',
        data: props.chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: props.isDarkMode ? 'rgba(252, 254, 254, 0.7)' : 'rgba(0,0,0)',
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
        },
    });
};

const destroyChart = () => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
};
</script>
