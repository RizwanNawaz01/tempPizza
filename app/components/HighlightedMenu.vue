<template>
    <ToastCustom :message="toastMessage" />

  <section id="highlights" class="pt-12 md:pt-12 pb-0 md:pb-0 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
    <div class="app-container">
      <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6 capitalize">{{t('highlights')}}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        <div 
          v-for="item in menuItems" 
          :key="item.id"
          class="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-200 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div>
            <div class="w-full mb-3 overflow-hidden rounded-xl">
              <div class="aspect-square w-full">
                <NuxtImg :alt="item.name" class="h-full w-full object-contain" :src="item.image"/>
              </div>
            </div>
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">{{ item.name }}</h3>
            <p v-if="item.description" class="text-xs sm:text-sm text-gray-600 line-clamp-2">{{ item.description }}</p>
          </div>
          <div class="mt-3 sm:mt-4 flex justify-between items-center">
            <span class="text-sm sm:text-base font-bold text-primary">CHF {{ item.priceDelivery.toFixed(2) }}</span>
            <button 
              @click="addToCart(item)"
              class="bg-oil text-black px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow hover:scale-105 bg-yellow-300 active:scale-95 active:bg-yellow-400 transition cursor-pointer" 
              title="In den Warenkorb"
            >+</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const cart = useCartStore()
const menuItems = ref([]) 
const toastMessage = ref('') 
const storeLanguage = useLanguageStore()
const t = (key) => storeLanguage.t(key)

async function fetchHighlightedProducts() {
  try {
    const products = await $fetch('/api/admin/product')
    menuItems.value = products.filter(p => p.isHighlighted)
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const addToCart = (item) => {
  cart.addToCart(item)
   toastMessage.value = `Item added to cart!`
 
}

onMounted(() => {
  fetchHighlightedProducts()
})
</script>
