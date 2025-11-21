<template>
  <aside id="default-sidebar" class="absolute top-10 left-20 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
    <div class="px-3 py-4 overflow-y-auto bg-gray-50">
      <ul class="space-y-2 font-medium">
        <li>
          <NuxtLink to="/admin/dashboard" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="radix-icons:dashboard" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="ms-3">Dashboard</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/admin/orders" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="radix-icons:clipboard" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 whitespace-nowrap">Orders</span>
            <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
              {{ orders?.length || 0 }}
            </span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/admin/customers" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="icon-park-solid:every-user" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 whitespace-nowrap">Customers</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/admin/categories" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="ep:notification" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 whitespace-nowrap">Categories</span>
          </NuxtLink>
        </li>

        <!-- 🔽 Collapsible Products -->
        <li>
          <button @click="toggleMenu('products')" class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="icon-park-solid:list-bottom" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 text-left whitespace-nowrap">Products</span>
            <Icon :name="openMenu === 'products' ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-4 h-4 text-gray-500" />
          </button>
          <ul v-if="openMenu === 'products'" class="pl-10 mt-2 space-y-1">
            <li>
              <NuxtLink to="/admin/products" class="block p-2 text-gray-700 rounded hover:bg-gray-100">All Products</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/admin/products/submenu" class="block p-2 text-gray-700 rounded hover:bg-gray-100">Sub Menu List</NuxtLink>
            </li>
          </ul>
        </li>

        <li>
          <NuxtLink to="/admin/sliders" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="ep:film" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="ms-3">Slider</span>
          </NuxtLink>
        </li>

        <li>
          <button @click="toggleMenu('cities')" class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="clarity:building-line" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 text-left whitespace-nowrap">Cities</span>
            <Icon :name="openMenu === 'cities' ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-4 h-4 text-gray-500" />
          </button>
          <ul v-if="openMenu === 'cities'" class="pl-10 mt-2 space-y-1">
            <li>
              <NuxtLink to="/admin/cities" class="block p-2 text-gray-700 rounded hover:bg-gray-100">City List</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/admin/postal_codes" class="block p-2 text-gray-700 rounded hover:bg-gray-100">Postal Codes</NuxtLink>
            </li>
          </ul>
        </li>

        <li>
          <NuxtLink to="/admin/settings" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="material-symbols:settings-slow-motion" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 whitespace-nowrap">Admin Settings</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/admin/pages" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="pajamas:review-list" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 whitespace-nowrap">Pages</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/admin/about" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
            <Icon name="ep:picture-rounded" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 whitespace-nowrap">About</span>
          </NuxtLink>
        </li>

        <li>
          <a @click="logout" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer">
            <Icon name="icon-park-solid:lock" class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
            <span class="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const authStore = useAuthStore()
const orders = ref([])
const openMenu = ref(null)

function toggleMenu(menu) {
  openMenu.value = openMenu.value === menu ? null : menu
}

const logout = async () => {
  try {
    await authStore.logout()
    await navigateTo({ path: '/' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const fetchOrders = async () => {
  try {
    const res = await $fetch('/api/admin/orders')
    orders.value = res.orders
  } catch (err) {
    console.error('Failed to fetch orders', err)
  }
}

onMounted(fetchOrders)
</script>
