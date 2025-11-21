<template>
  <div    :class="isSignupOpen ? '' : 'hidden'"    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"  >
    <div  ref="ModalRef" class="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
      <h2 class="text-xl font-semibold mb-4">Registrieren</h2>
      <button   class="absolute top-5 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"  @click="emit('closeSignup')" >✕</button>
        <form class="space-y-3" @submit.prevent="handleSubmit">
            <div class="flex gap-4">
                <input   v-model="form.firstName" placeholder="Vorname" required="" class="w-1/2 border border-gray-300 p-2 rounded" name="firstName">
                <input   v-model="form.lastName" placeholder="Name" required="" class="w-1/2 border border-gray-300 p-2 rounded"name="lastName">
            </div>
             <PhoneInput v-model="form.phoneNumber" />
            <input   v-model="form.street" placeholder="Strasse" required="" class="w-full border border-gray-300 p-2 rounded" name="street">
            <div class="flex gap-4">
                <select name="city" v-model="form.city" required="" class="w-1/2 border border-gray-300 p-2 rounded bg-white" @change="handleCityChange">
                <option value="">Ort</option>
                  <option
                    v-for="city in cities"
                    :key="city.id"
                    :value="city.name"
                  >
                    {{ city.name }}
                  </option>
                </select>
                <select  v-model="form.postalCode" name="postalCode" required="" class="w-1/2 border border-gray-300 p-2 rounded bg-white">
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
            <input   v-model="form.email" placeholder="E-Mail" required="" class="w-full border border-gray-300 p-2 rounded" type="email"  >
            <div class="relative">
                <input   v-model="form.password"  ref="passwordInput" placeholder="Passwort" required="" class="w-full border border-gray-300 p-2 rounded pr-24" :type="showPasswordField ? 'text' : 'password'" name="password">
                <button  @click="togglePassword"  type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100" aria-label="Passwort anzeigen">{{ showPasswordField ? 'Verbergen' : 'Anzeigen' }}</button>
            </div>
            <button type="submit" class="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 disabled:opacity-60"> {{ isLoading ? 'Wird registriert...' : 'Registrieren' }}</button>
        </form>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const cities = ref([])
const postalCodes = ref([])

const form = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  street: '',
  city: '',
  postalCode: '',
  email: '',
  password: ''
})

const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await authStore.signup(form.value)
    emit('closeSignup')
    this.$nuxt.refresh()
  } catch (error) {
   router.go(0)
  } finally {
    isLoading.value = false
  }
}


const props = defineProps({
  isSignupOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['closeSignup', 'openLogin']);
const ModalRef = ref(null) 
const showPasswordField = ref(false)
const passwordInput = ref(null)
  

// Handle outside clicks
const handleClickOutside = (event) => {
  if (ModalRef.value && !ModalRef.value.contains(event.target)) {
    if(props.isSignupOpen){
        emit('closeSignup')
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
   fetchCities()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const togglePassword = () => {
  showPasswordField.value = !showPasswordField.value
  nextTick(() => {
    passwordInput.value?.focus()
  })
}
 
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

</script>
