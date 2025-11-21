<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar />

      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold text-slate-900">Order Details</h2>
              <div class="flex gap-2" v-if="order">
                <button
                  @click="printOrder"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Print
                </button>
                <select
                  v-model="order.status"
                  @change="updateStatus"
                  class="px-3 py-2 border rounded bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div v-if="order" class="space-y-6">
              <!-- Order Info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Order Code:</strong> {{ order.orderCode }}</p>
                  <p><strong>Status:</strong> <span class="capitalize">{{ order.status }}</span></p>
                  <p><strong>Delivery Type:</strong> {{ order.deliveryType || 'lieferung' }}</p>
                  <p><strong>Total:</strong> ${{ order.totalPrice?.toFixed(2) }}</p>
                </div>

                <!-- Customer Info -->
                <div v-if="order.customerInfo">
                  <h3 class="text-xl font-medium mb-2">Customer Information</h3>
                  <ul class="list-disc list-inside space-y-1">
                    <li v-for="(value, key) in order.customerInfo" :key="key">
                      <strong>{{ formatKey(key) }}:</strong> {{ value }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Items -->
              <div v-if="order.items?.length">
                <h3 class="text-xl font-medium mb-2">Items</h3>
                <table class="w-full border border-gray-200 rounded text-left">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 border-b">Product</th>
                      <th class="px-4 py-2 border-b">Quantity</th>
                      <th class="px-4 py-2 border-b">Sub Menu</th>
                      <th class="px-4 py-2 border-b">Price</th>
                      <th class="px-4 py-2 border-b">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.id" class="hover:bg-gray-50">
                      <td class="px-4 py-2 border-b">{{ item.name }}</td>
                      <td class="px-4 py-2 border-b">{{ item.quantity }}</td>
                       <td class="px-4 py-2 border-b">
                          <div v-if="item.extras && item.extras.length">
                            <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                              <li v-for="extra in item.extras" :key="extra.id">
                                {{ extra.name }} (+CHF {{ extra.price.toFixed(2) }})
                              </li>
                            </ul>
                          </div>
                          <span v-else>-</span>
                        </td>
                      <td class="px-4 py-2 border-b">CHF {{ item.price?.toFixed(2) }}</td>
                      <td class="px-4 py-2 border-b">{{ item.note || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-4">
                <NuxtLink
                  :to="'/admin/orders'"
                  class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Back to Orders
                </NuxtLink>
              </div>
            </div>

            <div v-else class="text-gray-500">Loading order details...</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const order = ref(null)
const route = useRoute()

// Format JSON keys to readable text
const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}

// Fetch single order by ID
const fetchOrder = async () => {
  try {
    const id = route.params.id
    const res = await $fetch(`/api/admin/orders/${id}`)
    order.value = res.order
  } catch (err) {
    console.error('Failed to fetch order', err)
  }
}

// Update order status
const updateStatus = async () => {
  if (!order.value) return
  try {
    const id = route.params.id
    await $fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: { status: order.value.status }
    })
    alert('Order status updated!')
  } catch (err) {
    console.error('Failed to update status', err)
  }
}

// Print order
const printOrder = () => {
  if (!order.value) return

  const o = order.value

  // Generate receipt-style HTML
  const receiptHTML = `
    <html>
      <head>
        <title>Order Receipt - ${o.orderCode}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
            color: #222;
          }
          h2, h3 {
            text-align: center;
            margin: 0;
          }
          h2 {
            font-size: 20px;
            margin-bottom: 5px;
          }
          h3 {
            font-size: 16px;
            margin-top: 10px;
            border-bottom: 1px dashed #aaa;
            padding-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          td, th {
            padding: 6px 4px;
            font-size: 14px;
          }
          th {
            text-align: left;
            border-bottom: 1px dashed #999;
          }
          tr td:last-child {
            text-align: right;
          }
          .total {
            border-top: 2px solid #000;
            font-weight: bold;
          }
          .info p {
            margin: 4px 0;
            font-size: 14px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h2>Order Receipt</h2>
        <p style="text-align:center; font-size:13px; color:#555;">Order Code: ${o.orderCode}</p>

        <div class="info">
          <h3>Customer Information</h3>
          ${
            o.customerInfo
              ? Object.entries(o.customerInfo)
                  .map(
                    ([key, value]) =>
                      `<p><strong>${key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (s) => s.toUpperCase())}:</strong> ${value}</p>`
                  )
                  .join('')
              : '<p>No customer info available</p>'
          }
        </div>

        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${o.items
              ?.map(
                (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price?.toFixed(2)}</td>
                </tr>
                ${
                  item.subMenu && item.subMenu.length
                    ? `<tr><td colspan="3" style="font-size:12px; color:#666;">Sub Menu: ${item.subMenu.join(
                        ', '
                      )}</td></tr>`
                    : ''
                }
              `
              )
              .join('')}
            <tr class="total">
              <td colspan="2">Total</td>
              <td>$${o.totalPrice?.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Thank you for your order!</p>
          <p>${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `

  // Open print window
  const printWindow = window.open('', '', 'width=400,height=600')
  if (printWindow) {
    printWindow.document.write(receiptHTML)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}

onMounted(fetchOrder)
</script>
