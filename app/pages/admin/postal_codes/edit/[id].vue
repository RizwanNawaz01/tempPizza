<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar />
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <h2 class="text-xl font-semibold mb-6">Edit Postal Code</h2>

            <form @submit.prevent="updatePostalCodes" class="space-y-4">
              <!-- Postal Code Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="postalCode.name"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Postal code name"
                />
              </div>

              <!-- City Select -->
              <div>
                <label class="block text-sm font-medium text-gray-700">City</label>
                <select
                  v-model="postalCode.cityId"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Please Select City</option>
                  <option
                    v-for="city in cities"
                    :key="city.id"
                    :value="city.id"
                  >
                    {{ city.name }}
                  </option>
                </select>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="bg-green-500 text-white px-6 py-2 rounded"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const cities = ref([])

// model shape
const postalCode = ref({
  name: '',
  cityId: '' // 👈 single city only
})

// ✅ Fetch all cities
async function fetchCities() {
  try {
    cities.value = await $fetch('/api/admin/cities')
  } catch (error) {
    console.error('Failed to fetch cities:', error)
  }
}

// ✅ Fetch existing postal code
async function fetchPostalCode() {
  try {
    const id = route.params.id
    const data = await $fetch(`/api/admin/postal_codes/${id}`)
    postalCode.value = {
      name: data.name,
      cityId: data.cities[0].id // 👈 single city id from API
    }
  } catch (error) {
    console.error('Failed to fetch postal code:', error)
  }
}

// ✅ Update postal code
async function updatePostalCodes() {
  try {
    const id = route.params.id
    await $fetch(`/api/admin/postal_codes/${id}`, {
      method: 'PUT',
      body: postalCode.value
    })
    alert('Postal code updated successfully!')
    router.push('/admin/postal_codes')
  } catch (error) {
    console.error('Failed to update postal code:', error)
  }
}

onMounted(() => {
  fetchCities()
  fetchPostalCode()
})
</script>
