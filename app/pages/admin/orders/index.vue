<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar />

      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <h2 class="text-xl text-slate-900 font-semibold mb-6">Orders List</h2>

              <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th class="px-6 py-3">Customer</th>
                    <th class="px-6 py-3">Items</th>
                    <th class="px-6 py-3">Total</th>
                    <th class="px-6 py-3">Delivery Type</th>
                    <th class="px-6 py-3">Status</th>
                    <th class="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="order in orders"
                    :key="order.id"
                    class="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {{ order.user?.firstName || order.guestName }}
                    </th>
                    <td class="px-6 py-4">
                      <ul>
                        <li v-for="item in order.items" :key="item.id">
                          {{ item.quantity }} × {{ item.name }}
                        </li>
                      </ul>
                    </td>
                    <td class="px-6 py-4">
                      CHF {{ order.totalPrice.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4">
                      {{ order.deliveryType || 'lieferung' }}
                    </td>
                    <td class="px-6 py-4">
                     <span
                  class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                  :class="{
                    'bg-yellow-100 text-yellow-700': order.status === 'pending',
                    'bg-green-100 text-green-700': order.status === 'completed',
                    'bg-red-100 text-red-700': order.status === 'cancelled'
                  }"
                >
                  {{ order.status }}
                </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex justify-center items-center gap-4 ">
                         <NuxtLink
                          :to="`/admin/orders/edit/${order.id}`"
                          class="text-white flex items-center gap-1 bg-amber-950 p-2 rounded-full"
                        >
                          <Icon name="ep:printer" />
                        </NuxtLink>
                         <NuxtLink
                          :to="`/admin/orders/${order.id}`"
                          class="text-white  bg-cyan-400 flex items-center gap-1   p-2 rounded-full"
                        >
                          <Icon name="ep:view" />
                        </NuxtLink> 
                        <button
                          @click="deleteOrder(order.id)"
                          class="text-white bg-red-600 flex items-center gap-1   p-2 rounded-full"
                        >
                          <Icon name="icon-park-solid:delete-four" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="orders.length === 0">
                    <td colspan="5" class="text-center py-4 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const orders = ref([])
const router = useRouter()

// Fetch orders from API
const fetchOrders = async () => {
  try {
    const res = await $fetch('/api/admin/orders')
    orders.value = res.orders
  } catch (err) {
    console.error('Failed to fetch orders', err)
  }
}

// Delete order
const deleteOrder = async (id) => {
  if (!confirm('Are you sure you want to delete this order?')) return
  try {
    await $fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
    orders.value = orders.value.filter(order => order.id !== id)
  } catch (err) {
    console.error('Failed to delete order', err)
  }
}

onMounted(fetchOrders)
</script>
