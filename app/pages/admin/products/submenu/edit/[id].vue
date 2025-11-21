<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <h2 class="text-xl font-semibold mb-6">Edit Sub Menu</h2>
            <form @submit.prevent="updateSubmenu" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input v-model="submemu.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Price</label>
                <input v-model="submemu.price" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
              </div>
              <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const submemu = ref({ name: '',price:0 })

async function fetchSubmenu() {
  try {
    const id = route.params.id
    submemu.value = await $fetch(`/api/admin/product/submenu/${id}`)
  } catch (error) {
    console.error('Failed to fetch sub Memu:', error)
  }
}

async function updateSubmenu() {
  try {
    const id = route.params.id
    await $fetch(`/api/admin/product/submenu/${id}`, {
      method: 'PUT',
      body: submemu.value
    })
    alert('Sub Menu updated successfully!')
    router.push('/admin/products/submenu')
  } catch (error) {
    console.error('Failed to update submemu:', error)
  }
}

onMounted(() => {
  fetchSubmenu()
})
</script>
