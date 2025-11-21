<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Submenu Create</h2>
              </div>
              <form @submit.prevent="submitSubmenu" class="space-y-6">
                <!-- Main Product Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input v-model="submenu.name" placeholder="Sub Menu Name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Price</label>
                    <input v-model="submenu.price" placeholder="Sub Menu Price" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>
                </div> 
                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Save Sub Menu</button>
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

const submenu = reactive({
  name: '', 
  price: 0
})
 
async function submitSubmenu()  {
      try {
         const { data } = await $fetch('/api/admin/product/submenu/create', {
          method: 'POST',
          body: submenu
        })
        await navigateTo({ path: '/admin/products/submenu' })
   
  } catch (error) {
    console.error('Sub Menu failed:', error)
  }  
}
</script>
