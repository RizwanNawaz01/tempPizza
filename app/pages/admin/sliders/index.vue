<template>
    <main> 
        <div class="app-container relative px-3 pt-4"> 
            <AdminSidebar/>
            <div>
                <div class="p-4 sm:ml-64 lg:ml-80">
                <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                 <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
                    <div class="flex justify-between items-center  mb-6">
                        <h2 class="text-xl text-slate-900 font-semibold">Sliders List</h2>
                        <NuxtLink to="/admin/sliders/create" class="flex items-center gap-2 bg-primary py-2 p-4 text-white rounded-4xl "><Icon name="ep:plus" class="text-white" /> Create Slider</NuxtLink>
                    </div>
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-400">
                                <tr>
                                     <th scope="col" class="px-6 py-3">
                                        Sno
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Image
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        link
                                    </th> 
                                    <th scope="col" class="px-6 py-3">
                                        Actrion
                                    </th> 
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(slider,index) in sliders" :key="slider.id" class="bg-white border-b hover:bg-gray-50">
                                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ index +1}}</td>
                                    <td class="px-6 py-4">
                                        <img v-if="slider.image" :src="slider.image" class="w-16 h-16 object-cover rounded"/>
                                        <span v-else>No Image</span>
                                    </td>
                                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ slider.title }}</td>
                                    
                                    <td class="px-6 py-4">{{ slider.link}}</td>
                                   
                                    <td class="px-6 py-4 flex gap-4 items-center min-h-[100px]">
                                    <a @click.prevent="editslider(slider.id)" class="text-blue-600 flex items-center gap-1 cursor-pointer">
                                        <Icon name="icon-park-solid:edit"/> Edit
                                    </a>
                                    <a @click.prevent="deleteslider(slider.id)" class="text-red-600 flex items-center gap-1 cursor-pointer">
                                        <Icon name="icon-park-solid:delete-four"/> Delete
                                    </a>
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

const sliders = ref([])

async function fetchSliders() {
  try {
    sliders.value = await $fetch('/api/admin/slider')
  } catch (error) {
    console.error('Failed to fetch sliders:', error)
  }
}


async function editslider(id) {
  // Redirect to edit page
  navigateTo(`/admin/sliders/edit/${id}`)
}

async function deleteSlider(id) {
  if (!confirm('Are you sure you want to delete this Slider?')) return
  try {
    await $fetch(`/api/admin/slider/${id}`, { method: 'DELETE' })
    categories.value = categories.value.filter(cat => cat.id !== id)
    alert('Slider deleted successfully')
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}

onMounted(() => {
  fetchSliders()
})
</script>