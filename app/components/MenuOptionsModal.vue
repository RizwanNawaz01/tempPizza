<template>
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden shadow-lg relative flex flex-col">
                <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="emit('close')">✕</button>
                <div class="overflow-y-auto pr-2 mb-4">
                <h2 class="text-xl font-bold mb-2 text-primary">{{ props.menuItem.name }}</h2>
                <p class="text-sm text-gray-600 mb-4">{{ props.menuItem.description }}</p>
                <div class="mb-4">
                    <div class="mb-3">
                    <h3 class="font-semibold mb-1">Extra ingredients</h3>
                    <div class="space-y-1">
                        <label class="flex items-center text-sm" v-for="extra in props.menuItem.subMenu"  :key="extra.name">
                            <input class="mr-2 accent-primary" type="checkbox"  @change="toggleExtra(extra)">
                            <span class="mr-1 text-green-700 font-bold">+</span>
                            <span>{{ extra.name }} <span class="ml-1">{{ extra.price.toFixed(2) }} CHF</span>  </span>
                        </label> 
                    </div>
                    </div>
                </div>
                </div>
                <div class="border-t pt-3">
                <div class="flex justify-between items-center mb-2 text-sm text-gray-700">
                    <span>Additional costs:</span>
                    <span class="font-semibold">{{extraCost}} CHF</span>
                </div>
                <button class="w-full bg-oil text-black font-semibold py-2 rounded-full bg-yellow-300 transition"  @click="addToCart">Add to cart</button>
                </div>
            </div>
            </div>
</template>
 <script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  menuItem: Object
})
const emit = defineEmits(['close'])
const cart = useCartStore()

const selectedExtras = ref([])

const toggleExtra = (extra) => {
  const index = selectedExtras.value.findIndex(e => e.name === extra.name)
  if (index >= 0) selectedExtras.value.splice(index, 1)
  else selectedExtras.value.push(extra)
}

const extraCost = computed(() =>
  selectedExtras.value.reduce((sum, e) => sum + e.price, 0)
)

const addToCart = () => {
  const finalItem = {
    ...props.menuItem,
    extras: selectedExtras.value,
    totalPriceDelivery: parseFloat(props.menuItem.priceDelivery) + extraCost.value,
    totalPrice: parseFloat(props.menuItem.price_pickup) + extraCost.value
    
  }  
  cart.addToCart(finalItem)
  emit('close')
}
</script>
