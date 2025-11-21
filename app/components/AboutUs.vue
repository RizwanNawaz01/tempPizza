<template>
 <section id="about" class="py-16 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
  <div class="app-container">
    <div class="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-12">
      <div class="md:col-span-5">
        <img :src="about.image || '/images/about-img.png'" alt="About Us" class="w-full max-w-md mx-auto h-auto object-contain rounded">
      </div>
      <div class="md:col-span-7">
        <h3 class="text-3xl md:text-4xl font-bold text-primary mb-4">
            {{ t(about.title) }}
        </h3>
        <p class="text-base md:text-lg text-primary mb-4">
            {{ t(about.description) }}
        </p>
        <div class="text-base md:text-lg text-primary mb-4">
          <p class="font-semibold mb-2">{{t('Our services')}}:</p>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(service, index) in about.services" :key="index">
              <strong>{{ service.name }}:</strong> {{ service.description }}
            </li>
          </ul>
        </div>
        <div class="text-base md:text-lg text-primary mb-4 space-y-2">
          <p>
             {{ t('Look forward to unforgettable taste experiences – at our restaurant or in the comfort of your own home!')}}
          </p>
          <p v-if="about.address">📍 <strong>{{t('Address')}}:</strong> {{ t(about.address) }}</p>
          <p v-if="about.contact">📞 <strong>{{t('Order & Info')}}:</strong> {{ t(about.contact) }}</p>
          <p>{{t('Bon appetit!')}}</p>
        </div>
        <div class="text-sm text-primary space-y-1">
          <p>&gt; {{t('All prices include VAT')}}.</p>
          <p>&gt; {{t('All pizzas are cheaper when picked up!')}}</p>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
const storeLanguage = useLanguageStore()
 
 const t = (key) => storeLanguage.t(key)

const about = reactive({
  title: '',
  description: '',
  services: [],
  address: '',
  contact: '',
  image: ''
})

async function fetchAbout() {
  try {
    const data = await $fetch('/api/admin/about')

    if (data) {
      about.title = data.title || ''
      about.description = data.description || ''
      about.services = data.services || []
      about.address = data.address || ''
      about.contact = data.contact || ''
      about.image = data.image || ''
    }
  } catch (error) {
    console.error('Failed to fetch About data:', error)
  }
}

onMounted(() => {
  fetchAbout()
})
</script>
