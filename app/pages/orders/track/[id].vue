<template>
  <div class="max-w-screen-xl mx-auto flex px-6 pt-20 pb-20">
    <div class="max-w-6xl w-full">
      <!-- Heading -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{t('track-your-order')}}</h1>
        <p class="text-gray-500 mt-1">{{t('order')}} #{{ order.orderCode }}</p>
      </div>

      <!-- Progress Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">{{t('delivery-progress')}}</h2>
          <span
            class="text-sm font-medium px-3 py-1 rounded-full capitalize"
            :class="statusBadgeClass"
          >
            {{ t(order.status) }}
          </span>
        </div>

        <!-- Progress Steps -->
     <!-- Progress Steps -->
<div class="relative">
  <!-- Background Line -->
  <div class="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>

  <!-- Green Progress Line -->
  <div
    class="absolute top-4 left-0 h-1 bg-green-600 rounded-full transition-all duration-500 z-0"
    :style="{ width: ((activeStep / (steps.length - 1)) * 100) + '%' }"
  ></div>

  <!-- Step Circles and Labels -->
  <div class="flex justify-between relative z-10 mb-2">
    <template v-for="(step, index) in steps" :key="index">
      <div class="flex flex-col items-center w-1/4">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
          :class="index <= activeStep ? 'bg-green-600' : 'bg-gray-300'"
        >
          {{ index + 1 }}
        </div>
        <p
          class="text-sm mt-2"
          :class="index <= activeStep ? 'text-green-600 font-medium' : 'text-gray-400'"
        >
          {{ step }}
        </p>
      </div>
    </template>
  </div>
</div>
      </div>

      <!-- Delivery Info -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Delivery & Address -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-gray-700 font-medium mb-2">{{t('delivery-information')}}</h3>
            <p class="text-gray-600 text-sm mb-1">
              <span class="font-medium">{{t('customer')}}:</span>
              {{ order.customerName || order.guestName }}
            </p>
            <p class="text-gray-600 text-sm mb-1">
              <span class="font-medium">{{t('address')}}:</span>
              {{ order.address || order.guestAddress }}
            </p>
            <p class="text-gray-600 text-sm">
              <span class="font-medium">{{t('estimated-arrival')}}:</span>
              {{ order.eta || '30–45 minutes' }}
            </p>
          </div>

          <div v-if="order.notes" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-gray-700 font-medium mb-2">{{t('special-notes')}}</h3>
            <p class="text-gray-600 text-sm">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Right: Order Items -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">{{t('order-items')}}</h2>

          <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-3">
              <NuxtImg
                :src="item.image || '/images/dishes/pizza-15.png'"
                alt=""
                class="w-12 h-12 rounded-md object-cover"
              />
              <span class="text-gray-700">{{ item.quantity }} × {{ item.name }}</span>
            </div>
            <span class="font-medium text-gray-800">{{currency}} {{ (item.deliveryPrice || item.price).toFixed(2) }}</span>
          </div>

          <hr class="my-4" />

          <div class="flex justify-between text-gray-600 mb-1">
            <span>{{t('subtotal')}}</span>
            <span>{{currency}} {{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600 mb-3">
            <span>{{t('tax')}}</span>
            <span>{{currency}} {{ order.tax?.toFixed(2) || 0 }}</span>
          </div>

          <div class="flex justify-between text-lg font-semibold text-gray-800 border-t pt-3">
            <span>{{t('total')}}</span>
            <span>{{currency}} {{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSiteSettings } from '@/composables/useSiteSettings'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const orderId = route.params.id
const storeLanguage = useLanguageStore()
const t = (key) => storeLanguage.t(key)
const { siteSettings } = useSiteSettings()
const currency = ref('CHF')

const order = ref({
  id: '',
  orderCode: '',
  customerName: '',
  guestName: '',
  address: '',
  guestAddress: '',
  status: 'Order Received',
  eta: '',
  items: [],
  tax: 0,
  notes: ''
})

// Define progress steps
const steps = ['Order Received', 'Preparing', 'Out for Delivery', 'Completed']

// Map order status to progress index
const activeStep = computed(() => {
  const index = steps.findIndex((s) => s.toLowerCase() === order.value.status.toLowerCase())
  return index !== -1 ? index : 0
})

// Badge color
const statusBadgeClass = computed(() => { 
  switch (order.value.status?.toLowerCase()) {
    case 'order received':
      return 'bg-gray-100 text-gray-700'
    case 'preparing':
      return 'bg-yellow-100 text-yellow-700'
    case 'out for delivery':
      return 'bg-blue-100 text-blue-700'
    case 'completed':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

// Totals
const subtotal = computed(() =>
  order.value.items.reduce((sum, item) => sum + (item.deliveryPrice || item.price || 0) * item.quantity, 0)
)
const total = computed(() => subtotal.value + (order.value.tax || 0))

onMounted(async () => {
  try {
    const res = await $fetch(`/api/auth/orders/${orderId}`)
    order.value = res.order
  } catch (err) {
    console.error('Failed to fetch order', err)
  }
})


watch(siteSettings, (settings) => {
  if (!settings) return
  currency.value = settings.currency
})
</script>
