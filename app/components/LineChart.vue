<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const props = defineProps({
  chartData: { type: Array, default: () => [] },
});

const data = computed(() => ({
  labels: props.chartData.map((item) => item.date),
  datasets: [
    {
      label: "Earnings (AED)",
      data: props.chartData.map((item) => item.total),
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      fill: true,
      tension: 0.4,
    },
  ],
}));

const options = {
  responsive: true,
  plugins: {
    legend: { display: true, position: "top" },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
  },
};
</script>

<template>
  <Line :data="data" :options="options" />
</template>
