<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar />
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Products List</h2>
                <NuxtLink
                  to="/admin/products/create"
                  class="flex items-center gap-2 bg-primary py-2 p-4 text-white rounded-4xl"
                >
                  <Icon name="ep:plus" class="text-white" /> Create Products
                </NuxtLink>
              </div>

              <!-- Table -->
              <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3">Sno</th>
                    <th scope="col" class="px-6 py-3">Image</th>
                    <th scope="col" class="px-6 py-3">Item name</th>
                    <th scope="col" class="px-6 py-3">Qty</th>
                    <th scope="col" class="px-6 py-3">Price</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(product, index) in paginatedProducts"
                    :key="product.id"
                    class="bg-white border-b hover:bg-gray-50"
                  >
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {{ startIndex + index + 1 }}
                    </td>
                    <td class="px-6 py-4">
                      <img
                        v-if="product.image"
                        :src="product.image"
                        class="w-16 h-16 object-cover rounded"
                      />
                      <span v-else>No Image</span>
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {{ product.name }}
                    </td>
                    <td class="px-6 py-4">{{ product.subMenu?.length || 0 }}</td>
                    <td class="px-6 py-4">
                     {{ currency }} {{ product.priceDelivery || 0 }} / {{ product.pricePickup || 0 }}
                    </td>
                    <td class="px-6 py-4 flex gap-4 items-center min-h-[100px]">
                      <a
                        @click.prevent="editProduct(product.id)"
                        class="text-blue-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Icon name="icon-park-solid:edit" /> Edit
                      </a>
                      <a
                        @click.prevent="deleteProduct(product.id)"
                        class="text-red-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Icon name="icon-park-solid:delete-four" /> Delete
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="flex justify-between items-center my-6">
                <p class="text-sm text-gray-600">
                  Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, products.length) }} of
                  {{ products.length }} products
                </p>

                <div class="flex items-center gap-2">
                  <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span class="text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>

                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSiteSettings } from '@/composables/useSiteSettings'

const products = ref([])
const currentPage = ref(1)
const perPage = 10 // You can change to 5, 20, etc.
const currency = ref('CHF') 
const { siteSettings } = useSiteSettings()

const totalPages = computed(() => Math.ceil(products.value.length / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => startIndex.value + perPage)
const paginatedProducts = computed(() =>
  products.value.slice(startIndex.value, endIndex.value)
)

async function fetchProducts() {
  try {
    products.value = await $fetch('/api/admin/product')
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

async function editProduct(id) {
  navigateTo(`/admin/products/edit/${id}`)
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await $fetch(`/api/admin/product/${id}`, { method: 'DELETE' })
    products.value = products.value.filter(p => p.id !== id)
    alert('Product deleted successfully')
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

onMounted(() => {
  fetchProducts()
})

watch(siteSettings, (settings) => {
      if (!settings) return 
    currency.value = settings.currency

});
</script>
