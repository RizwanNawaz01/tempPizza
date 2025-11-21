<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <h2 class="text-xl font-semibold mb-6">Edit Category</h2>
            <form @submit.prevent="updateCategory" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input v-model="category.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
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
const category = ref({ name: '' })

async function fetchCategory() {
  try {
    const id = route.params.id
    category.value = await $fetch(`/api/admin/category/${id}`)
  } catch (error) {
    console.error('Failed to fetch category:', error)
  }
}

async function updateCategory() {
  try {
    const id = route.params.id
    await $fetch(`/api/admin/category/${id}`, {
      method: 'PUT',
      body: category.value
    })
    alert('Category updated successfully!')
    router.push('/admin/categories')
  } catch (error) {
    console.error('Failed to update category:', error)
  }
}

onMounted(() => {
  fetchCategory()
})
</script>
