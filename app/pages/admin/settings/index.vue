<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar />
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Edit Site Settings</h2>
              </div>

              <form @submit.prevent="submitSettings" class="space-y-8">

                <!-- SITE INFO -->
                <section>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">Site Information</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Site Name</label>
                      <input
                        v-model="settings.siteName"
                        type="text"
                        placeholder="Site Name"
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>

                    <!-- LOGO -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Site Logo</label>
                      <input type="file" @change="handleLogoUpload" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                      <div v-if="settings.logoPreview" class="mt-2">
                        <img :src="settings.logoPreview" alt="Logo Preview" class="h-20 object-contain"/>
                      </div>
                    </div>

                    <!-- FAVICON -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Favicon</label>
                      <input type="file" @change="handleFaviconUpload" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                      <div v-if="settings.faviconPreview" class="mt-2">
                        <img :src="settings.faviconPreview" alt="Favicon Preview" class="h-10 w-10 object-contain"/>
                      </div>
                    </div>
                  </div>
                </section>

                
                <!-- SITE INFO -->
                <section>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">Site SEO</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Meta Title</label>
                      <input
                        v-model="settings.metaTitle"
                        type="text"
                        placeholder="Meta Title"
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div> 
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Meta Description</label>
                      <input
                        v-model="settings.metaDescription"
                        type="text"
                        placeholder="Meta Description"
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div> 
                  </div>
                </section>

                <!-- ABOUT SECTION -->
                <section>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">About Section</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Title</label>
                      <input v-model="settings.title" placeholder="About Title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea v-model="settings.description" placeholder="About Description" class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                    </div>

                    <!-- SERVICES -->
                    <div>
                      <h3 class="text-lg font-semibold mb-2">Our Services</h3>
                      <div v-for="(service, index) in settings.services" :key="index" class="flex gap-2 items-center mb-2">
                        <input v-model="service.name" placeholder="Service Name" class="border border-gray-300 rounded-md p-2 flex-1"/>
                        <input v-model="service.description" placeholder="Description" class="border border-gray-300 rounded-md p-2 flex-1"/>
                        <button type="button" @click="removeService(index)" class="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                      </div>
                      <button type="button" @click="addService" class="bg-blue-500 text-white px-4 py-2 rounded">Add Service</button>
                    </div>
                  </div>
                </section>

                <!-- CONTACT INFO -->
                <section>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">Contact Details</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Address</label>
                      <input v-model="settings.address" placeholder="Address" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Contact Info</label>
                      <input v-model="settings.contact" placeholder="Phone or Website" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>
                  </div>
                </section>

                <!-- STORE SETTINGS -->
                <section>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">Store Configuration</h3>
                  <div class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Minimum Order Amount (CHF)</label>
                      <input v-model.number="settings.minOrder" type="number" placeholder="e.g. 30" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Site Currancy</label>
                      <input v-model="settings.currancy" type="text" placeholder="e.g. CHF" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Order Outside Time</label>
                      <input v-model="settings.order_outside_time" type="text" placeholder="e.g. Order Outside Time" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>

                    <div class="">
                        <h4 class="text-md font-semibold mb-2">Weekly Opening Hours</h4>
                        <div
                          v-for="day in settings.openingHours"
                          :key="day.day"
                          class="flex  gap-10 mb-3 border-b border-gray-300 pb-3"
                        >
                          <div class="flex gap-2 justify-between items-center">
                            <div class="font-medium text-gray-700 min-w-[100px]">{{ day.day }}</div>
                            <div class="flex items-center gap-3">
                              <label class="flex items-center gap-1 text-sm text-gray-700">
                                <input type="checkbox" v-model="day.closed" /> Closed
                              </label>
                              <label class="flex items-center gap-1 text-sm text-gray-700">
                                <input type="checkbox" v-model="day.doubleShift" /> 2 Times
                              </label>
                            </div>
                          </div>

                          <div v-if="!day.closed">
                            <!-- FIRST TIME RANGE -->
                            <div class="flex items-center gap-2 mb-2">
                              <input v-model="day.shifts[0].open" type="time" class="border border-gray-300 rounded-md p-1.5" />
                              <span>to</span>
                              <input v-model="day.shifts[0].close" type="time" class="border border-gray-300 rounded-md p-1.5" />
                            </div>

                            <!-- SECOND TIME RANGE -->
                            <div v-if="day.doubleShift" class="flex items-center gap-2">
                              <input v-model="day.shifts[1].open" type="time" class="border border-gray-300 rounded-md p-1.5" />
                              <span>to</span>
                              <input v-model="day.shifts[1].close" type="time" class="border border-gray-300 rounded-md p-1.5" />
                            </div>
                          </div>
                        </div>
                      </div>

                  </div>
                </section>

                <!-- SAVE -->
                <div class="mt-8 mb-6">
                  <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded">Save Settings</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div> 
    </div>  
  </main>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const settings = reactive({
  siteName: '',
  logo: null,
  logoPreview: '',
  favicon: null,
  faviconPreview: '',
  title: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  services: [],
  address: '',
  contact: '',
  currancy: '',
  order_outside_time:'',
  minOrder: '',
 openingHours: [
    { day: 'Monday', closed: false, doubleShift: false, shifts: [{ open: '09:00', close: '18:00' }, { open: '17:00', close: '22:00' }] },
    { day: 'Tuesday', closed: false, doubleShift: false, shifts: [{ open: '09:00', close: '18:00' }, { open: '17:00', close: '22:00' }] },
    { day: 'Wednesday', closed: false, doubleShift: false, shifts: [{ open: '09:00', close: '18:00' }, { open: '17:00', close: '22:00' }] },
    { day: 'Thursday', closed: false, doubleShift: false, shifts: [{ open: '09:00', close: '18:00' }, { open: '17:00', close: '22:00' }] },
    { day: 'Friday', closed: false, doubleShift: false, shifts: [{ open: '09:00', close: '18:00' }, { open: '17:00', close: '22:00' }] },
    { day: 'Saturday', closed: false, doubleShift: true, shifts: [{ open: '10:00', close: '14:00' }, { open: '17:00', close: '22:00' }] },
    { day: 'Sunday', closed: true, doubleShift: false, shifts: [{ open: '10:00', close: '16:00' }, { open: '17:00', close: '22:00' }] },
  ]
})

onMounted(fetchSettings)

async function fetchSettings() {
  try {
    const data = await $fetch('/api/admin/settings')
    if (!data) return
    Object.assign(settings, data)
    settings.logoPreview = data.logo || ''
    settings.faviconPreview = data.favicon || ''
    settings.currancy = data.currency || '' 
  } catch (err) {
    console.error('Failed to fetch settings:', err)
  }
}

function addService() {
  settings.services.push({ name: '', description: '' })
}

function removeService(index) {
  settings.services.splice(index, 1)
}

function handleLogoUpload(e) {
  const file = e.target.files?.[0]
  if (file) {
    settings.logo = file
    settings.logoPreview = URL.createObjectURL(file)
  }
}

function handleFaviconUpload(e) {
  const file = e.target.files?.[0]
  if (file) {
    settings.favicon = file
    settings.faviconPreview = URL.createObjectURL(file)
  }
}

async function submitSettings() {
  try {
    const formData = new FormData()
    
    formData.append('siteName', settings.siteName)
    formData.append('title', settings.title)
    formData.append('description', settings.description)
    formData.append('metaTitle', settings.metaTitle)
    formData.append('metaDescription', settings.metaDescription)
    formData.append('address', settings.address)
    formData.append('contact', settings.contact)
    formData.append('currancy', settings.currancy)
    formData.append('order_outside_time', settings.order_outside_time)
    
    formData.append('minOrder', settings.minOrder)

    // Services as JSON string
    formData.append('services', JSON.stringify(settings.services))
    formData.append('openingHours', JSON.stringify(settings.openingHours))

    // Files
    if (settings.logo) formData.append('logo', settings.logo)
    if (settings.favicon) formData.append('favicon', settings.favicon)
    console.log(settings)
    await $fetch('/api/admin/settings', {
      method: 'POST',
      body: formData
    })

    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

</script>
