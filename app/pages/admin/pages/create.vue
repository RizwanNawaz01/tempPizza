<template>
    <main class="min-h-[800px]"> 
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Page Create</h2>
              </div>

              <form @submit.prevent="submitPage" class="space-y-6">

                <!-- Main Page Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input v-model="page.title" placeholder="Page Title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Slug</label>
                    <input v-model="page.slug" placeholder="Page Slug" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Meta Title</label>
                    <input v-model="page.metaTitle" placeholder="Page Meta Title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Meta Description</label>
                    <textarea v-model="page.metaDescription" placeholder="Page Meta Description" class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Content</label>
                      <textarea v-model="page.content" placeholder="Content" class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                  </div> 
                </div> 
                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Save Page</button>
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
import {reactive} from 'vue'

const page = reactive({
  title: '',
  slug: '',
  content: '',
  metaDescription:'',
  metaTitle:''
})


async function submitPage() {
  try {
    const formData = new FormData()
    formData.append('title', page.title)
    formData.append('slug', page.slug) 
    formData.append('content', page.content) 
    formData.append('metaTitle', page.metaTitle) 
    formData.append('metaDescription', page.metaDescription) 
 
    const result = await $fetch('/api/admin/pages', {
      method: 'POST',
      body: formData
    })

    alert('Page saved successfully!')
    Object.assign(page, { name:'', content:'', slug:'' })
  } catch (error) {
    console.error('Failed to save page:', error)
  }
}
</script>
