<template>
    <main>
       <div class="bg-purple-50 sm:px-8 px-4 py-6">
            <div class="max-w-screen-xl max-lg:max-w-xl mx-auto">
              <div class="grid lg:grid-cols-2 gap-y-12 gap-8">
                <div class="max-w-4xl w-full h-max rounded-md">
                  <form>
                    <div>
                      <h2 class="text-xl text-slate-900 font-semibold mb-6">{{ t('delivery-details')}}</h2>
                      <div class="grid lg:grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">{{ t('first-name') }}</label>
                          <input required="true" type="text" v-model="form.firstName" :placeholder="t('enter-first-name')" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2"> {{ t('last-name') }}</label>
                          <input required="true" type="text"  v-model="form.lastName"  :placeholder="t('enter-last-name')" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2"> {{ t('email') }}</label>
                          <input type="email" :disabled="disabledEmail"  v-model="form.email" :placeholder="t('enter-email')" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">  {{ t('phone-no') }}</label>
                          <PhoneInput v-model="form.phoneNumber" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2"> {{ t('address-line') }}</label>
                          <input  required="true" type="text"  v-model="form.address" :placeholder="t('enter-address-line')" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">  {{ t('street') }}</label>
                          <input type="text" v-model="form.street"    :placeholder="t('enter-street')" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2"> {{ t('city') }}</label>
                           <select name="city" v-model="form.city" required="" class="w-full border border-gray-300 p-2 rounded bg-white" @change="handleCityChange">
                            <option value="">Ort</option>
                              <option
                                v-for="city in cities"
                                :key="city.id"
                                :value="city.name"
                              >
                                {{ city.name }}
                              </option>
                            </select>   
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">  {{ t('postal-code') }}</label>
                          <select  v-model="form.postalCode" name="postalCode" required="" class="w-full border border-gray-300 p-2 rounded bg-white">
                          <option value="">Postleitzahl</option>
                          <option
                              v-for="postal in postalCodes"
                              :key="postal.id"
                              :value="postal.name"
                            >
                              {{ postal.name }}
                            </option>
                          </select>  
                        </div>
                      </div>
                    </div>
                    <div class="mt-10">
                      <h2 class="text-xl text-slate-900 font-semibold mb-6">  {{ t('payment') }}</h2>
                      <div class="flex flex-wrap gap-y-6 gap-x-12 mt-4 mb-8">
                        <div class="hidden items-center">
                          <input type="radio" name="pay-method" class="w-5 h-5 cursor-pointer" id="card"  />
                          <label for="card" class="ml-4 flex gap-2 cursor-pointer">
                            <img src="https://readymadeui.com/images/visa.webp" class="w-12" alt="card1" />
                            <img src="https://readymadeui.com/images/american-express.webp" class="w-12" alt="card2" />
                            <img src="https://readymadeui.com/images/master.webp" class="w-12" alt="card3" />
                          </label>
                        </div>
                        <div class="hidden items-center">
                          <input type="radio" name="pay-method" class="w-5 h-5 cursor-pointer" id="paypal" />
                          <label for="paypal" class="ml-4 flex gap-2 cursor-pointer">
                            <img src="https://readymadeui.com/images/paypal.webp" class="w-20" alt="paypalCard" />
                          </label>
                        </div>
                        <div class="flex items-center">
                          <input type="radio" name="pay-method" class="w-5 h-5 cursor-pointer" id="cod" checked />
                          <label for="cod" class="ml-4 flex gap-2 cursor-pointer">
                            <img src="https://png.pngtree.com/png-clipart/20210606/original/pngtree-cash-on-delivery-icon-png-image_6390451.jpg" class="w-20" alt="codCard" />
                          </label>
                        </div>
                      </div>
                      <div class="hidden lg:grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">Cardholder's Name</label>
                          <input type="text" placeholder="Enter Cardholder's Name" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">Card Number</label>
                          <input type="text" placeholder="Enter Card Number" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">Expiry</label>
                          <input type="text" placeholder="Enter EXP." class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                        <div>
                          <label class="text-sm text-slate-900 font-medium block mb-2">CVV</label>
                          <input type="text" placeholder="Enter CVV" class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600" />
                        </div>
                      </div>
                      <div class="flex gap-4 max-lg:flex-col mt-8">
                        <NuxtLink to="/" type="button" class="rounded-md px-4 py-2.5 text-center w-full text-sm font-medium tracking-wide bg-gray-200 hover:bg-gray-300 border border-gray-300 text-slate-900 max-lg:order-1 cursor-pointer"> {{ t('continue-shopping') }}</NuxtLink>
                        <button @click="submitOrder" :disabled="cart.totalItems==0" type="button" class="rounded-md px-4 py-2.5 w-full text-sm font-medium tracking-wide bg-primary hover:bg-primary/90 text-white cursor-pointer"> {{ t('complete-purchase') }}</button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="max-lg:-order-1">
                  <h2 class="text-xl text-slate-900 font-semibold mb-6">   {{ t('order-summary') }}</h2>
                      <div class="mt-3 mb-6 flex gap-2">
                        <button
                          class="flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition capitalize"
                          :class="
                            cart.deliveryType === 'lieferung'
                              ? 'bg-primary hover:bg-primary/90 text-white'
                              : 'border border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                          "
                          @click="cart.deliveryType = 'lieferung'"
                        >
                          {{ t('delivery')}}
                        </button>
                        <button
                          class="flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition capitalize"
                          :class="
                            cart.deliveryType === 'abholung'
                              ? 'bg-primary hover:bg-primary/90 text-white'
                              : 'border border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                          "
                          @click="cart.deliveryType = 'abholung'"
                        >
                          
                          {{ t('pickup')}}
                        </button>
                      </div>
                  <div class="relative bg-white border border-gray-300 rounded-md">
                    <div class="px-6 py-8 md:overflow-auto">
                      <div class="space-y-4">
                        
                        <div  v-for="(item, index) in cart.items"   :key="item.id">
                        <div class="flex gap-4 max-sm:flex-col">
                          <div class="w-24 h-24 shrink-0 bg-purple-50 p-2 rounded-md">
                            <NuxtImg  :src="item.image || '/images/dishes/pizza-15.png'" class="w-full h-full object-contain" />
                          </div>
                          <div class="w-full flex justify-between gap-4">
                            <div>
                              <h3 class="text-sm font-medium text-slate-900"> {{ item.name }}</h3>
                              <p class="text-xs text-green-700 flex items-center gap-1"   v-for="(extra, index) in item.extras"  :key="index">  <span class="font-bold">+</span>{{ extra.name }}({{currency}} {{ extra.price }})</p>
                             <h6 class="text-[15px] text-slate-900 font-semibold mt-2">
                                    {{currency}}  {{ ( cart.deliveryType === 'lieferung' ? item.priceDelivery: item.pricePickup).toFixed(2)}}
                            </h6>
                            </div>
                            <div class="flex flex-col justify-between items-end gap-4">
                              <div>
                                <svg  @click.stop="removeToCart(item.id)" xmlns="http://www.w3.org/2000/svg" class="w-4 fill-red-500 inline cursor-pointer" viewBox="0 0 24 24">
                                  <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" data-original="#000000"></path>
                                  <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" data-original="#000000"></path>
                                </svg>
                              </div>
                              <div class="flex items-center px-2.5 py-1.5 border border-gray-400 text-slate-900 text-xs font-medium outline-0 bg-transparent rounded-md">
                                <button type="button" class="cursor-pointer border-0 outline-0" @click.stop="decreseToCart(item)">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 fill-current" viewBox="0 0 124 124">
                                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000"></path>
                                  </svg>
                                </button>
                                <span class="mx-3">{{ item.quantity }}</span>
                                <button type="button" class="cursor-pointer border-0 outline-0"   @click.stop="addToCart(item)">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 fill-current" viewBox="0 0 42 42">
                                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div> 
                        </div>
                          <hr class="border-gray-300 my-6"  v-if="index !== cart.items.length - 1" />  
                        </div>
                        <p v-if="!cart.items.length" class="text-center text-gray-500 py-4">{{t('cart-empty')}} </p>
                      </div>
                      <hr class="border-gray-300 my-6" />
                      <div v-if="cart.items.length">
                        <ul class="text-slate-500 font-medium space-y-4">
                          <li class="flex flex-wrap gap-4 text-sm"> {{ t('subtotal') }} <span class="ml-auto font-semibold text-slate-900">{{currency}}  {{ subtotal.toFixed(2) }}</span>
                          </li>
                          <li class="flex flex-wrap gap-4 text-sm"> {{ t('shipping') }} <span class="ml-auto font-semibold text-slate-900">{{currency}}  {{ shipping.toFixed(2) }}</span>
                          </li>
                          <li class="flex flex-wrap gap-4 text-sm">{{ t('tax') }} <span class="ml-auto font-semibold text-slate-900">{{currency}}  {{ tax.toFixed(2) }}</span>
                          </li>
                          <hr class="border-slate-300" />
                          <li class="flex flex-wrap gap-4 text-[15px] font-semibold text-slate-900 capitalize">{{ t('total') }} <span class="ml-auto">{{currency}}  {{ totalPrice.toFixed(2) }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </main>
</template>


<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { computed, ref ,watch } from 'vue' 
import { useSiteSettings } from '@/composables/useSiteSettings'
import { useLanguageStore } from '@/stores/language'

const cart = useCartStore() 
const authStore = useAuthStore()
const disabledEmail = ref(false)
const { siteSettings } = useSiteSettings()
const minOrder =  ref(200)
const storeLanguage = useLanguageStore()
const currency = ref('CHF') 
const order_outside_time = ref() 
const openingHours = ref() 
const isOpen = isWithinOpeningHours()

const cities = ref([])
const postalCodes = ref([])

const form = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  street: '', 
  email: '',
  password: ''
})

const addToCart = (item) => cart.addToCart(item)
const removeToCart = (id) => cart.removeFromCart(id)
const decreseToCart = (item) => cart.decreseToCart(item)
 
const t = (key) => storeLanguage.t(key)

onMounted(async () => {
    try {
        await authStore.fetchUser()  // fetch the user asynchronously
        if(authStore.user) {
          form.value.firstName = authStore.user.firstName
          form.value.lastName = authStore.user.lastName
          form.value.email = authStore.user.email
          form.value.phoneNumber = authStore.user.phoneNumber
          form.value.address = authStore.user.address
          form.value.city = authStore.user.city
          form.value.street = authStore.user.street
          form.value.postalCode = authStore.user.postalCode
          form.value.eta = authStore.user.postalCode
          disabledEmail.value = true
        }
  } catch (err) {
    console.error("Failed to fetch user:", err)
  }

  
   fetchCities()
})


const subtotal = computed(() => {
  return cart.items.reduce((sum, item) => {
    const price =
      cart.deliveryType === 'lieferung'
        ? item.priceDelivery
        : item.pricePickup
    return sum + price * item.quantity
  }, 0)
})

const shipping = computed(() =>
  cart.deliveryType === 'lieferung' && subtotal.value > 0 ? 6 : 0
)
const tax = computed(() => subtotal.value * 0.05)
const totalPrice = computed(
  () => subtotal.value + shipping.value + tax.value
) 
const submitOrder = async () => {
  try {

    if(totalPrice.value < minOrder.value){
          alert(`Ordre Price need to be higher then ${minOrder.value}`)
          return;
    }   
 
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'postalCode', 'phoneNumber'];

for (const field of requiredFields) {
  if (!form.value[field]) {
    alert(`Please fill in ${field}`);
    return; // stop submission
  }
}

if (!isOpen) {
  form.value.eta = order_outside_time.value || 'Outside working hours'
}


      const payload = {
      userId: authStore.user?.id || null, 
      ...form.value,  
      items: cart.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        extras: item.extras,
        price: cart.deliveryType === 'lieferung' ? item.priceDelivery : item.pricePickup
      })),
      totalPrice: totalPrice.value,
      deliveryType: cart.deliveryType,
    }

    const res = await $fetch('/api/auth/orders', {
      method: 'POST',
      body: payload
    })

    // Clear cart and show success
    cart.clearCart()
    await navigateTo({ path: `/confirmed/${res.order.id}` })
      } catch (err) {
        console.error(err)
        alert('Failed to submit order. Please try again.')
      }
    }
    watch(siteSettings, (settings) => {
          if (!settings) return
        minOrder.value = settings.minOrder
        currency.value = settings.currency
        order_outside_time.value = settings.order_outside_time 
        openingHours.value = settings.openingHours
    });


async function fetchCities() {
  try {
    cities.value = await $fetch('/api/admin/cities')
 
  } catch (error) {
    console.error('Failed to fetch cities:', error)
  }
}
 
async function handleCityChange() {
  if (!form.value.city) {
    postalCodes.value = []
    form.value.postalCode = ''
    return
  }
  try {
    postalCodes.value = await $fetch(`/api/admin/postal_codes?city=${form.value.city}`)
  } catch (error) {
    console.error('Failed to fetch postal codes:', error)
  }
}

function isWithinOpeningHours() {
  if (!openingHours.value || !Array.isArray(openingHours.value)) return false

  const now = new Date()
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }) // e.g., "Monday"
  const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"

  const today = openingHours.value.find(d => d.day === currentDay)
  if (!today || today.closed) return false

  // Check if current time is within any of today's shifts
  for (const shift of today.shifts) {
    const open = shift.open
    const close = shift.close

    if (currentTime >= open && currentTime <= close) {
      return true
    }
  }

  return false
}



</script>
