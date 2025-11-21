<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Category Create</h2>
              </div>
              <form @submit.prevent="submitCategory" class="space-y-6">
                <!-- Main Product Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input v-model="category.name" placeholder="Category Name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>
                </div> 
                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Save Category</button>
                </div>
              </form>
            </div>   
          </div>
        </div>
      </div> 
    </div>  
  </main>
</template>

<script setup>
import { reactive } from 'vue'

const category = reactive({
  name: '', 
})

 
async function submitCategory()  {
      try {
         const { data } = await $fetch('/api/admin/category/create', {
          method: 'POST',
          body: category
        })
        await navigateTo({ path: '/admin/categories' })

   
    // Show success message or redirect
  } catch (error) {
    // Handle error (show toast message)
    console.error('Category failed:', error)
  }  
}
</script>
