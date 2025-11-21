<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Postal Codes</h2>
              </div>
              <form @submit.prevent="submitPostalCodes" class="space-y-6">
                <!-- Main Product Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input v-model="postalCode.name" placeholder="Postal Code Name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">City</label>
                    <select v-model="postalCode.city"  class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                      <option value="">Please Select City</option>
                      <option  :value="city.id" v-for="city in cities" :key="city.id">{{ city.name }}</option>
                    </select> 
                  </div>
                </div> 
                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Save Postal</button>
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
import { ref, onMounted,reactive } from 'vue'
const cities = ref([])

const postalCode = reactive({
  name: '', 
  city: '', 
})

 
async function submitPostalCodes()  {
      try {
         const { data } = await $fetch('/api/admin/postal_codes/create', {
          method: 'POST',
          body: postalCode
        })
        await navigateTo({ path: '/admin/postal_codes' })

   
    // Show success message or redirect
  } catch (error) {
    // Handle error (show toast message)
    console.error('Postal Codes failed:', error)
  }  
}


async function fetchCities() {
  try {
    cities.value = await $fetch('/api/admin/cities')
  } catch (error) {
    console.error('Failed to fetch cities:', error)
  }
}

onMounted(() => { 
  fetchCities()
})
</script>
