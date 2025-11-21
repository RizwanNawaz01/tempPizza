<template>
    <aside  ref="cartRef" :class="isCartOpen?'':'hidden'" class="fixed right-0 top-4 bottom-4 w-[92vw] max-w-sm   sm:top-0 sm:bottom-0 sm:w-96 bg-white rounded-l-2xl sm:rounded-none shadow-xl z-50 transform transition-transform duration-300  translate-x-0" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div class="flex items-center justify-between p-4 border-b">
            <h2 id="cart-title" class="text-lg font-semibold text-primary capitalize">{{ t('cart') }}</h2>
            <button  @click.stop="$emit('closeCart')" aria-label="Close cart" class="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer">×</button>
        </div>
        <div class="h-[calc(100%-56px)] overflow-y-auto p-4">
            <div class=" w-full max-w-md h-full flex flex-col">
            <div class="mt-3 mb-4 flex gap-2">
            <button
            class="flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition capitalize"
            :class="cart.deliveryType === 'lieferung' ? 'bg-primary hover:bg-primary/90 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:border-primary/50'"
            @click="cart.deliveryType = 'lieferung'"
          >
            {{ t('delivery') }}
          </button>
          <button
            class="flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition capitalize"
            :class="cart.deliveryType === 'abholung' ? 'bg-primary hover:bg-primary/90 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:border-primary/50'"
            @click="cart.deliveryType = 'abholung'"
          >
            {{ t('pickup') }} 
          </button>         
            </div>
            <ul class="space-y-3 flex-1 overflow-y-auto pr-1">
                <li class="border border-gray-300 p-2 rounded text-sm"   v-for="item in cart.items" :key="item.id" >
                <div class="flex justify-between">
                    <div>
                    <div class="font-medium">{{ item.name }} x {{ item.quantity }}</div>
                    <p class="text-xs text-green-700 flex items-center gap-1"   v-for="(extra, index) in item.extras" >
                        <span class="font-bold">+</span>{{ extra.name }} ({{currency}} {{  extra.price}})
                    </p>
                    
                    </div>
                    <div class="font-semibold">{{currency}}  {{
                  (cart.deliveryType === 'lieferung'
                    ? item.priceDelivery
                    : item.pricePickup) * item.quantity
                }} </div>
                </div>
                <div class="flex items-center mt-2 gap-2">
                    <button class="px-2 py-1 border border-gray-300  rounded text-xs"  @click.stop="decreseToCart(item)">–</button>
                    <span>{{ item.quantity }}</span>
                    <button class="px-2 py-1 border border-gray-300  rounded text-xs" @click.stop="addToCart(item)">+</button>
                    <button class="ml-auto text-red-500 text-xs hover:underline capitalize"  @click.stop="removeToCart(item.id)">{{ t('clear')  }}</button>
                </div>
                <textarea :placeholder="t('note (optional)')"   v-model="item.note"   @blur="updateNote(item)" rows="1" class="mt-2 w-full border border-gray-300  p-1 text-xs rounded"></textarea>
                 <button
                    v-if="item.note"
                    class="text-red-500 text-xs mt-1 hover:underline capitalize cursor-pointer"
                    @click.stop="clearNote(item)"
                  >
                    {{ t('clear-note') }}
                  </button>
                </li>
            </ul>
            <div class="mt-4 space-y-2">
                <p class="text-right font-bold capitalize">{{t('total')}} : {{currency}} {{ totalPrice.toFixed(2) }}</p>
                <NuxtLink to="/checkout"   @click.stop="closeCartFun" class="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded hover:bg-opacity-90 block text-center capitalize">{{ t('checkout')  }}</NuxtLink>
                <button class="w-full text-sm text-gray-500 hover:underline capitalize"   @click="cart.clearCart"> {{  t('clear cart') }}</button>
            </div>
            </div>
        </div>
    </aside>
</template>


<script setup>
import { useSiteSettings } from '@/composables/useSiteSettings'
const storeLanguage = useLanguageStore()
 

const { siteSettings } = useSiteSettings()
const t = (key) => storeLanguage.t(key)

import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const cartRef = ref(null) 
const currency = ref('CHF') 

const props = defineProps({
  isCartOpen: {
    type: Boolean,
    required: true
  }
}) 

const emit = defineEmits(['closeCart'])

// Handle outside clicks
const handleClickOutside = (event) => {
  if (cartRef.value && !cartRef.value.contains(event.target)) {
    if(props.isCartOpen){
        emit('closeCart')
    }
  }
}

const closeCartFun = (event) => {
        emit('closeCart')

}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const addToCart = (item) => {
  cart.addToCart(item)
};


const removeToCart = (item) => {
  cart.removeFromCart(item)
};

const decreseToCart = (item) => {
  cart.decreseToCart(item)
};

const totalPrice = computed(() => {
  return cart.items.reduce((sum, item) => {
     const price =
      cart.deliveryType === 'lieferung'
        ? item.priceDelivery
        : item.pricePickup

    const itemTotal = cart.deliveryType === 'lieferung'?(item.totalPriceDelivery || price) * item.quantity:(item.totalPrice || price) * item.quantity
    return sum + itemTotal
  }, 0)
})


const updateNote = (item) => {  
  cart.updateItemNote(item.id, item.note || '')
}

const clearNote = (item) => {
  item.note = ''
  cart.updateItemNote(item.id, '')
}


watch(siteSettings, (settings) => {
  if (settings?.currency) { 
    currency.value = settings.currency
  } 
})

</script>