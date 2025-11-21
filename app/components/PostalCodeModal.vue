<template>
  <div v-if="isPostalCodeOpen" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div ref="ModalRef" class="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
      <h2 class="text-xl font-semibold mb-4">Choose Delivery Zone</h2>

      <button
        class="absolute top-5 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        @click="emit('closePostalCode')"
      >
        ✕
      </button>

      <div>
        <div class="flex gap-4">
          <select
            name="city"
            v-model="form.city"
            required
            class="w-1/2 border border-gray-300 p-2 rounded bg-white"
            @change="handleCityChange"
          >
            <option value="">Ort</option>
            <option v-for="city in cities" :key="city.id" :value="city.name">
              {{ city.name }}
            </option>
          </select>

          <select
            v-model="form.postalCode"
            name="postalCode"
            required
            class="w-1/2 border border-gray-300 p-2 rounded bg-white"
          >
            <option value="">Postleitzahl</option>
            <option v-for="postal in postalCodes" :key="postal.id" :value="postal.name">
              {{ postal.name }}
            </option>
          </select>
        </div>

        <div class="mt-6 flex items-center gap-4">
          <button
            type="button"
            class="w-full bg-primary text-white py-2 rounded disabled:opacity-60"
            @click="saveDelivery"
          >
            Save
          </button>

          <p class="text-center">OR</p>

          <button
            type="button"
            class="w-full bg-primary text-white py-2 rounded disabled:opacity-60"
            @click="savePickup"
          >
            Pickup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  isPostalCodeOpen: Boolean,
})
const emit = defineEmits(['closePostalCode', 'savePostalCode'])

const cities = ref([])
const postalCodes = ref([])
const form = ref({ city: '', postalCode: '' })
const ModalRef = ref(null)

onMounted(() => {
  fetchCities()
})

// ✅ Load cities
async function fetchCities() {
  try {
    cities.value = await $fetch('/api/admin/cities')
  } catch (error) {
    console.error('Failed to fetch cities:', error)
  }
}

// ✅ Load postal codes (filtered by city)
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

const saveDelivery = () => {
  if (!form.value.city || !form.value.postalCode) return
  emit('savePostalCode', {
    mode: 'delivery',
    city: form.value.city,
    postalCode: form.value.postalCode,
  })
}

const savePickup = () => {
  emit('savePostalCode', { mode: 'pickup' })
}
</script>
