<template>
    <main> 
        <div class="app-container relative px-3 pt-4"> 
            <AdminSidebar/>
            <div>
                <div class="p-4 sm:ml-64 lg:ml-80">
                <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                 <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
                    <div class="flex justify-between items-center  mb-6">
                        <h2 class="text-xl text-slate-900 font-semibold">Postal Codes List</h2>
                        <NuxtLink to="/admin/postal_codes/create" class="flex items-center gap-2 bg-primary py-2 p-4 text-white rounded-4xl "><Icon name="ep:plus" class="text-white" /> Create Postal Codes</NuxtLink>
                    </div>
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Sno
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                        Item name
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                        City name
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                       Created At
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                        Actrion
                                    </th> 
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-white border-b  border-gray-200 hover:bg-gray-50 " v-for="(postalCode, index) in postalCodes" :key="postalCode.id">
                                   <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                                        {{ index+1 }}
                                    </th> 
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                                        {{ postalCode.name }}
                                    </th> 
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                                        {{ postalCode.city.name }}
                                    </th> 
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                                        {{ new Date(postalCode.createdAt).toLocaleString() }}
                                    </th> 
                                    <td class="px-6 py-4">
                                         <div class="flex justify-start items-center gap-4">
                                            <a href="" class="text-blue-600 flex items-center gap-1" @click.prevent="editPostalCode(postalCode.id)">
                                                <Icon name="icon-park-solid:edit"/>
                                                Edit 
                                            </a>
                                            <a href="" class="text-red-600 flex items-center gap-1" @click.prevent="deletePostalCode(postalCode.id)">
                                                <Icon name="icon-park-solid:delete-four"/>
                                                Delete 
                                            </a>
                                         </div>
                                    </td>
                                
                                </tr> 
                            </tbody>
                        </table>
                        
              <div v-if="postalCodes.length === 0" class="text-gray-500 mt-4 flex justify-center pb-6">
                No Postal Codes found.
              </div>

                            </div>   
                </div>
                </div>
            </div> 
        </div>  
    </main>
</template> 
<script setup> 
import { ref, onMounted } from 'vue'

const postalCodes = ref([])

async function fetchCities() {
  try {
    postalCodes.value = await $fetch('/api/admin/postal_codes')
  } catch (error) {
    console.error('Failed to fetch postalCodes:', error)
  }
}
onMounted(() => {
  fetchCities()
})


async function editPostalCode(id) {
  // Redirect to edit page
  navigateTo(`/admin/postal_codes/edit/${id}`)
}

async function deletePostalCode(id) {
  if (!confirm('Are you sure you want to delete this postal_codes?')) return
  try {
    await $fetch(`/api/admin/postal_codes/${id}`, { method: 'DELETE' })
    postalCodes.value = postalCodes.value.filter(cat => cat.id !== id)
    alert('City deleted successfully')
  } catch (error) {
    console.error('Failed to delete postal_codes:', error)
  }
}
</script>
