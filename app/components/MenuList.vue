<template>
  <section id="menu" class="pt-12 md:pt-20 pb-0 md:pb-8 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-white">
    <div class="app-container">
      <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6">{{t('menu_list')}}</h2>

      <!-- Category strip -->
      <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 px-1 sm:px-2 py-2 -mx-1 sm:-mx-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="categoryBtnClass(cat.id)"
          class="px-4 py-2 rounded-full border transition-all duration-150 snap-start whitespace-nowrap cursor-pointer"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Grid -->
      <div class="relative">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-1 sm:px-2 py-6">
          <template v-for="item in filteredMenu" :key="item.id">
            <div
              class="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <h3 class="text-sm font-semibold text-primary mb-1">{{ item.name }}</h3>
                <p class="text-xs text-gray-600 line-clamp-2" v-if="item.description">{{ item.description }}</p>
              </div>

              <div class="mt-3 flex justify-between items-center">
                <span class="text-sm font-medium text-primary">CHF {{ item.priceDelivery }}</span>
                <button
                  class="bg-oil text-black px-3 py-1 rounded-full text-sm font-bold shadow hover:scale-105 bg-yellow-300 active:scale-95 active:bg-yellow-400 transition-all duration-150 ease-in-out"
                  title="In den Warenkorb"
                   @click="addToCart(item)"
                >
                  +
                </button>
              </div>
            </div>
          </template>

          <div v-if="filteredMenu.length === 0" class="col-span-full text-center text-gray-500 py-8">
            Keine Einträge in dieser Kategorie.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed ,onMounted} from 'vue'
const storeLanguage = useLanguageStore()
 
const t = (key) => storeLanguage.t(key)

const cart = useCartStore()
const emit = defineEmits(['openSubMenu']);
const categories = ref([]) 
const selectedCategory = ref('all') // default to Pizza as you asked


async function fetchCategories() {
  try {
    const data = await $fetch('/api/admin/category')
   categories.value = [{ id: 'all', name: 'Alle' }, ...data]
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}


const menu = ref([])

async function fetchProducts() {
  try {
     const data =await $fetch('/api/admin/product')  
      menu.value = data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
} 

onMounted(() => {
  fetchCategories()
  fetchProducts()
})


const filteredMenu = computed(() => {
  if (selectedCategory.value === 'all') return menu.value
  // For other categories we currently only have 'Pizza' items.
  return menu.value.filter(i => i.categoryId === selectedCategory.value)
})

function categoryBtnClass(cat) {
  if (selectedCategory.value === cat) {
    return 'bg-primary text-white shadow-md scale-[1.03]'
  }
  return 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
}


const addToCart = (item) => {
  if(item.subMenu && item.subMenu.length != 0){  
      emit('openSubMenu', item);
    return;
  }
  cart.addToCart(item)
};
</script>

 