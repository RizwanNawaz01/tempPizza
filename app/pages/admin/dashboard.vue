<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar />
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-6 border-2 border-gray-200 border-dashed rounded-lg bg-white">
            <h2 class="text-2xl font-semibold text-slate-900 mb-6">Dashboard Overview</h2>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="stat in stats"
                :key="stat.title"
                class="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-all rounded-xl shadow-sm p-5"
              >
                <div>
                  <p class="text-gray-500 text-sm font-medium">{{ stat.title }}</p>
                  <h3 class="text-2xl font-bold text-slate-800 mt-2">{{ stat.value }}</h3>
                </div>
                <div
                  class="w-12 h-12 flex items-center justify-center rounded-full text-white"
                  :class="stat.color"
                >
                  <Icon :name="stat.icon" class="w-6 h-6" />
                </div>
              </div>
            </div>

               <!-- Earnings Chart -->
            <div class="mt-10">
              <h3 class="text-lg font-semibold text-slate-800 mb-4">Earnings (Last 7 Days)</h3>
              <div class="bg-gray-50 rounded-xl p-6">
                <LineChart v-if="chartData.length" :chart-data="chartData" />
                <p v-else class="text-gray-400 text-center py-12">Loading chart...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, onMounted } from "vue";
import LineChart from "~/components/LineChart.vue";  

const chartData = ref([]);
const stats = ref([]);

async function fetchStats() {
  try {
    const res = await $fetch("/api/admin/stats");
    stats.value = [
      { title: "Total Orders", value: res.totalOrders || 0, icon: "ph:shopping-cart-simple", color: "bg-blue-500" },
      { title: "Success Orders", value: res.successOrders || 0, icon: "ph:check-circle", color: "bg-green-500" },
      { title: "Pending Orders", value: res.pendingOrders || 0, icon: "ph:clock", color: "bg-yellow-500" },
      { title: "Cancelled Orders", value: res.cancelledOrders || 0, icon: "ph:x-circle", color: "bg-red-500" },
      { title: "Total Products", value: res.totalProducts || 0, icon: "ph:cube", color: "bg-indigo-500" },
      { title: "Total Earnings", value: `CHF ${res.totalEarnings || 0}`, icon: "ph:currency-dollar", color: "bg-emerald-500" },
      { title: "Total Categories", value: res.totalCategories || 0, icon: "ph:squares-four", color: "bg-purple-500" },
      { title: "Total Users", value: res.totalUsers || 0, icon: "ep:user-filled", color: "bg-orange-500" },
    ];
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
}

async function fetchChart() {
  try {
    const data = await $fetch("/api/admin/earnings");
    chartData.value = data;
  } catch (error) {
    console.error("Failed to load chart:", error);
  }
}

onMounted(() => {
  fetchStats();
  fetchChart();
});
</script>
