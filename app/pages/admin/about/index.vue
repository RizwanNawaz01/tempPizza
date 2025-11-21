<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Edit About Section</h2>
              </div>

              <form @submit.prevent="submitAbout" class="space-y-6">

                <!-- Main Title & Description -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input v-model="about.title" placeholder="About Title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Main Description</label>
                    <textarea v-model="about.description" placeholder="About Description" class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                  </div>

                  <!-- Services -->
                  <div>
                    <h3 class="text-lg font-semibold mb-2">Our Services</h3>
                    <div v-for="(service, index) in about.services" :key="index" class="flex gap-2 items-center mb-2">
                      <input v-model="service.name" placeholder="Service Name" class="border border-gray-300 rounded-md p-2 flex-1"/>
                      <input v-model="service.description" placeholder="Description" class="border border-gray-300 rounded-md p-2 flex-1"/>
                      <button type="button" @click="removeService(index)" class="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                    </div>
                    <button type="button" @click="addService" class="bg-blue-500 text-white px-4 py-2 rounded">Add Service</button>
                  </div>

                  <!-- Address & Contact -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <input v-model="about.address" placeholder="Address" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Contact Info</label>
                    <input v-model="about.contact" placeholder="Phone or Website" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <!-- Image -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Image</label>
                    <input type="file" @change="handleFileUpload" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    <div v-if="about.image" class="mt-2">
                      <img :src="about.image" alt="Preview" class="h-32 w-32 object-cover rounded"/>
                    </div>
                  </div>
                </div>

                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Save About Section</button>
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
import { reactive, ref, onMounted, computed } from 'vue'

const about = reactive({
  title: '',
  description: '',
  services: [
    { name: 'Fast delivery', description: 'Warm and fresh to your home' },
    { name: 'Pick-up service', description: 'Pick up from us easily and conveniently' }
  ],
  address: '',
  contact: '',
  image: null
})
 

async function fetchAbout() {
  try {
    const data = await $fetch('/api/admin/about')

    if (data) {
      // Prefill reactive object
      about.title = data.title || ''
      about.description = data.description || ''
      about.services = data.services || [
        { name: 'Fast delivery', description: 'Warm and fresh to your home' },
        { name: 'Pick-up service', description: 'Pick up from us easily and conveniently' }
      ]
      about.address = data.address || ''
      about.contact = data.contact || ''
      about.image = data.image || ''
      // Set image preview
    
    }
  } catch (error) {
    console.error('Failed to fetch About data:', error)
  }
}



function addService() {
  about.services.push({ name: '', description: '' })
}

function removeService(index) {
  about.services.splice(index, 1)
}

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (file) about.image = file
}
 

onMounted(() => {
  fetchAbout()
})

async function submitAbout() {
  try {
    const formData = new FormData()
    formData.append('title', about.title)
    formData.append('description', about.description)
    formData.append('services', JSON.stringify(about.services))
    formData.append('address', about.address)
    formData.append('contact', about.contact)
    if (about.image) formData.append('image', about.image)

    await $fetch('/api/admin/about', {
      method: 'POST',
      body: formData
    })

    alert('About section saved successfully!')
  } catch (error) {
    console.error('Failed to save About section:', error)
  }
}
</script>
