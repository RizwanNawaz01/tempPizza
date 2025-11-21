<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Slider Create</h2>
              </div>

              <form @submit.prevent="submitSlider" class="space-y-6">

                <!-- Slider Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input v-model="slider.title" placeholder="Slider Title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input v-model="slider.subtitle" placeholder="Slider Subtitle" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">gradident</label>
                    <input v-model="slider.gradident" placeholder="gradident (CSS value)" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Small Title</label>
                    <input v-model="slider.smallTitle" placeholder="Small Title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Small Subtitle</label>
                    <input v-model="slider.smallSubtitle" placeholder="Small Subtitle" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">link Name</label>
                    <input v-model="slider.linkName" placeholder="Optional link Name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Link</label>
                    <input v-model="slider.link" placeholder="Optional link" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>


                  <div>
                    <label class="block text-sm font-medium text-gray-700">Order</label>
                    <input v-model.number="slider.order" placeholder="Order" type="number" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Image</label>
                    <input type="file" @change="handleFileUpload" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div class="flex items-center gap-2 mt-4">
                    <input type="checkbox" v-model="slider.isActive" id="active"/>
                    <label for="active" class="text-sm font-medium text-gray-700">Active</label>
                  </div>

                </div>

                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Save Slider</button>
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

const slider = reactive({
  title: '',
  subtitle: '',
  gradident: '',
  smallTitle: '',
  linkName: '',
  smallSubtitle: '',
  link: '',
  order: 0,
  image: null,
  isActive: true
})

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (file) slider.image = file
}

async function submitSlider() {
  try {
    const formData = new FormData()
    formData.append('title', slider.title)
    formData.append('subtitle', slider.subtitle)
    formData.append('gradident', slider.gradident)
    formData.append('smallTitle', slider.smallTitle)
    formData.append('linkName', slider.linkName)
    formData.append('smallSubtitle', slider.smallSubtitle)
    formData.append('link', slider.link)
    formData.append('order', slider.order.toString())
    formData.append('isActive', slider.isActive ? 'true' : 'false')

    if (slider.image) {
      formData.append('image', slider.image)
    }

    const result = await $fetch('/api/admin/slider', {
      method: 'POST',
      body: formData
    })

    alert('Slider saved successfully!')
    Object.assign(slider, { title:'', subtitle:'', gradident:'',linkName:'', smallTitle:'', smallSubtitle:'', link:'', order:0, image:null, isActive:true })

  } catch (error) {
    console.error('Failed to save slider:', error)
  }
}
</script>
