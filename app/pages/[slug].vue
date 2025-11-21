<template>
    <main>
      <div class="app-container px-6 ">
       <div class="bg-purple-50   py-6">
            <div class="max-w-screen-xl max-lg:max-w-xl mx-auto">
                <h1 class="text-3xl font-bold mb-4">{{ page.title }}</h1>
                <div v-html="page.content" class="prose max-w-none"></div>
            </div>
        </div> 
      </div>
    </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue' 

const route = useRoute()
const page = ref({})

onMounted(async () => { 
fetchPage()
  
})

// Fetch pages from API
const fetchPage = async () => {
  try {  
    const res = await $fetch(`/api/pages/${route.params.slug}`)
    page.value = res 
  } catch (err) {
    console.error('Failed to fetch pages', err)
  }
}

</script>
