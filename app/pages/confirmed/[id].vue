<template>
  <div class="max-w-screen-xl max-lg:max-w-xl mx-auto flex px-6 pt-20 pb-20">
    <div class="max-w-6xl w-full">
      <!-- Heading -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Thank You for Your Order!</h1>
        <p class="text-gray-500 mt-1">Order # {{ order.orderCode }}</p>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Section -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Order Status Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-1">Order Received</h2>
            <p class="text-gray-500 mb-4">From {{ order.customerName || order.guestName }}</p>

            <!-- Progress Bar -->
            <div class="flex items-center space-x-2 mb-6">
              <div class="flex-1 h-1 bg-green-500 rounded-full"></div>
              <div class="flex-1 h-1 bg-gray-200 rounded-full"></div>
              <div class="flex-1 h-1 bg-gray-200 rounded-full"></div>
              <div class="flex-1 h-1 bg-gray-200 rounded-full"></div>
            </div>

            <!-- Estimate -->
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm">Estimate arrival time</p>
                <p class="font-medium text-gray-800">{{ order.eta || '30–45 minutes' }}</p>
              </div>
              <NuxtLink  :to="`/orders/track/${order.id}`" class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                Track order
              </NuxtLink>
            </div>
          </div>

          <!-- Address Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-gray-700 font-medium mb-1">Order Address</h3>
            <p class="text-gray-500 text-sm">{{ order.address || order.guestAddress }}</p>
          </div>
        </div>

        <!-- Right Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Details</h2>

          <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-3">
              <NuxtImg :src="item.image || '/images/dishes/pizza-15.png'" alt="" class="w-12 h-12 rounded-md object-cover" />
              <span>{{ item.quantity }} {{ item.name }}</span>
            </div>
            <span class="font-medium">${{ (item.deliveryPrice || item.price).toFixed(2) }}</span>
          </div>

          <hr class="my-4" />

          <div class="flex justify-between text-gray-600 mb-1">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600 mb-3">
            <span>Tax</span>
            <span>${{ order.tax?.toFixed(2) || 0 }}</span>
          </div>

          <div class="flex justify-between text-lg font-semibold text-gray-800 border-t pt-3">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.params.id

const order = ref({
  id: '',
  customerName: '',
  guestName: '',
  address: '',
  guestAddress: '',
  items: [],
  tax: 0,
})

// Compute subtotal and total dynamically
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
</script>
