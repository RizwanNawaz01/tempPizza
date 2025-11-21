<template>
  <main class="min-h-[800px]"> 
    <div class="app-container relative px-3 pt-4"> 
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Sub Menus List</h2>
                <NuxtLink 
                  to="/admin/products/submenu/create"
                  class="flex items-center gap-2 bg-primary py-2 p-4 text-white rounded-4xl">
                  <Icon name="ep:plus" class="text-white" /> Create Sub Menu
                </NuxtLink>
              </div>

              <!-- Table -->
              <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3">Sno</th> 
                    <th scope="col" class="px-6 py-3">Item name</th>
                    <th scope="col" class="px-6 py-3">Item Price</th>  
                    <th scope="col" class="px-6 py-3">Created At</th> 
                    <th scope="col" class="px-6 py-3">Action</th> 
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(sub, index) in paginatedSubmenus"
                    :key="sub.id"
                    class="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                    </th>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                      {{ sub.name }}
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {{ currency }} {{ sub.price.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {{ new Date(sub.createdAt).toLocaleString() }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-4">
                        <a 
                          href="" 
                          class="text-blue-600 flex items-center gap-1"
                          @click.prevent="editSubMenu(sub.id)">
                          <Icon name="icon-park-solid:edit" /> Edit 
                        </a>
                        <a 
                          href="" 
                          class="text-red-600 flex items-center gap-1"
                          @click.prevent="deleteSubMenu(sub.id)">
                          <Icon name="icon-park-solid:delete-four" /> Delete 
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- No data -->
              <div v-if="submenus.length === 0" class="text-gray-500 mt-4 text-center pb-2">
                No Sub Menu found.
              </div>

              <!-- Pagination -->
              <div class="flex justify-between items-center my-6">
                <div class="text-sm text-gray-600">
                  Showing {{ startItem }}–{{ endItem }} of {{ totalItems }} results
                </div>
                <div class="flex gap-2 items-center">
                  <button
                    class="px-3 py-1 border rounded disabled:opacity-50"
                    :disabled="currentPage === 1"
                    @click="currentPage--">
                    Previous
                  </button>
                                    <span class="text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>
                  <button
                     class="px-3 py-1 border rounded disabled:opacity-50"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useSiteSettings } from '@/composables/useSiteSettings'

const submenus = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const currency = ref('CHF')
const { siteSettings } = useSiteSettings()

// Fetch data
async function fetchSubmenus() {
  try {
    submenus.value = await $fetch('/api/admin/product/submenu')
  } catch (error) {
    console.error('Failed to fetch submenu:', error)
  }
}

onMounted(() => {
  fetchSubmenus()
})

// CRUD
function editSubMenu(id) {
  navigateTo(`/admin/products/submenu/edit/${id}`)
}

async function deleteSubMenu(id) {
  if (!confirm('Are you sure you want to delete this Sub Menu?')) return
  try {
    await $fetch(`/api/admin/product/submenu/${id}`, { method: 'DELETE' })
    submenus.value = submenus.value.filter(sub => sub.id !== id)
    alert('SubMenu deleted successfully')
  } catch (error) {
    console.error('Failed to delete submenu:', error)
  }
}

// Pagination
const totalItems = computed(() => submenus.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const paginatedSubmenus = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return submenus.value.slice(start, end)
})
const startItem = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1))
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

// Currency
watch(siteSettings, (settings) => {
  if (settings) currency.value = settings.currency
})
</script>
