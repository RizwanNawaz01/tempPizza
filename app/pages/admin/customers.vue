<template>
    <main> 
        <div class="app-container relative px-3 pt-4"> 
            <AdminSidebar/>
            <div>
                <div class="p-4 sm:ml-64 lg:ml-80">
                <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                 <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
                      <h2 class="text-xl text-slate-900 font-semibold mb-6">Customers List</h2>
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-400">
                                <tr><th scope="col" class="px-6 py-3">
                                        Sno
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Customer Name
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        City
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Postal Code
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                        User Type
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                        Actrion
                                    </th> 
                                </tr>
                            </thead>
                            <tbody>
                              
                                <tr class="bg-white border-b  border-gray-200 hover:bg-gray-50 " 
                                v-for="(customer,index) in customers" :key="customer.id"
                                >
                                
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                       {{ index+1 }}
                                    </th>
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                       {{ customer.firstName }}
                                    </th>
                                    <td class="px-6 py-4">
                                       {{ customer.email }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ customer.city }}
                                    </td>
                                    <td class="px-6 py-4">
                                        {{ customer.postalCode }}
                                    </td>
                                    <td class="px-6 py-4 capitalize">
                                        {{ customer.userType }}
                                    </td>
                                    <td class="px-6 py-4">
                                         <div class="flex justify-start items-center gap-4"> 
                                            <a href="" class="text-red-600 flex items-center gap-1">
                                                <Icon name="icon-park-solid:delete-four"/>
                                                Delete 
                                            </a>
                                         </div>
                                    </td>
                                
                                </tr>
                            </tbody>
                        </table>

                            </div>   
                </div>
                </div>
            </div> 
        </div>  
    </main>
</template> 

<script setup>
import { ref, onMounted } from 'vue'

const customers = ref([])

async function fetchCustomers() {
  try {
    customers.value = await $fetch('/api/admin/customers')
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  }
}

 
async function deleteCustomer(id) {
  if (!confirm('Are you sure you want to delete this customers?')) return
  try {
    await $fetch(`/api/admin/customers/${id}`, { method: 'DELETE' })
    categories.value = customers.value.filter(cat => cat.id !== id)
    alert('Customer deleted successfully')
  } catch (error) {
    console.error('Failed to delete Customer:', error)
  }
}

onMounted(() => {
  fetchCustomers()
})
</script>