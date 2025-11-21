<template>
  <main>
    <div class="app-container py-10">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-10 px-4 pt-7">
        <!-- Header and Filter -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl text-slate-900 font-semibold">{{ t('order-list') }}</h2>

          <div>
            <select
              v-model="selectedStatus"
              class="border border-gray-300 text-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{{ t('all') }}</option>
              <option value="pending">{{ t('pending') }}</option>
              <option value="completed">{{ t('completed') }}</option>
              <option value="cancelled">{{ t('cancelled') }}</option>
            </select>
          </div>
        </div>

        <!-- Orders Table -->
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3">S.No</th>
              <th class="px-6 py-3">{{ t('item-name') }}</th>
              <th class="px-6 py-3">{{ t('price') }}</th>
              <th class="px-6 py-3">{{ t('delivery-type') }}</th>
              <th class="px-6 py-3">{{ t('date-time') }}</th>
              <th class="px-6 py-3">{{ t('status') }}</th>
              <th class="px-6 py-3">{{ t('sction') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(order, index) in paginatedOrders"
              :key="order.id"
              class="bg-white border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

              <td class="px-6 py-4">
                <ul>
                  <li v-for="item in order.items" :key="item.id">
                    {{ item.quantity }} × {{ item.name }}
                  </li>
                </ul>
              </td>

              <td class="px-6 py-4">
                {{ currency }} {{ order.totalPrice.toFixed(2) }}
              </td>

              <td class="px-6 py-4">{{ t(order.deliveryType || 'delivery') }}</td>
              <td class="px-6 py-4">{{ formatDate(order.createdAt) }}</td>

              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                  :class="{
                    'bg-yellow-100 text-yellow-700': order.status === 'pending',
                    'bg-green-100 text-green-700': order.status === 'completed',
                    'bg-red-100 text-red-700': order.status === 'cancelled'
                  }"
                >
                  {{ t(order.status) }}
                </span>
              </td>

              <td class="px-6 py-4">
                <NuxtLink
                  :to="`/orders/track/${order.id}`"
                  class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full capitalize"
                >
                  {{ t('track-order') }}
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="text-center text-gray-500 py-8">
          {{ t('no-found') }}
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex justify-center items-center gap-2 mt-6 mb-6"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="py-1 bg-primary text-white capitalize rounded-full disabled:opacity-50 px-4"
          >
            {{ t('prev') || 'Previous' }}
          </button>

          <span class="text-black">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="py-1 bg-primary text-white capitalize rounded-full disabled:opacity-50 px-4"
          >
            {{ t('next') || 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSiteSettings } from '@/composables/useSiteSettings'
import { useLanguageStore } from '@/stores/language'

const storeLanguage = useLanguageStore()
const t = (key) => storeLanguage.t(key)

const currency = ref('CHF')
const { siteSettings } = useSiteSettings()
const orders = ref([])
const selectedStatus = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 3

// Date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Filtered orders
const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value
  return orders.value.filter((order) => order.status === selectedStatus.value)
})

// Paginated orders
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredOrders.value.slice(start, start + itemsPerPage)
})

// Pagination handlers
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Fetch orders
const fetchOrders = async () => {
  try {
    const res = await $fetch('/api/admin/orders')
    orders.value = res.orders
  } catch (err) {
    console.error('Failed to fetch orders', err)
  }
}

onMounted(fetchOrders)

watch(siteSettings, (settings) => {
  if (!settings) return
  currency.value = settings.currency
})

// Reset to first page on status filter change
watch(selectedStatus, () => {
  currentPage.value = 1
})
</script>
