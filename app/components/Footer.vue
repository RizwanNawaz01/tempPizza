<template>
<footer class="bg-gray-100 py-8" v-if="siteSettings">
  <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    <!-- Quick Links (static) -->
    <div>
      <h3 class="text-xl font-bold text-gray-800 mb-4">{{t('Quick Links')}}</h3>
      <ul class="space-y-2">
        <li v-for="service in siteSettings.services"> <a :href="service.description" class="text-gray-600 hover:text-primary">{{t(service.name)}}</a></li>
      </ul>
    </div>

    <!-- Contact Info -->
    <div>
      <h3 class="text-xl font-bold text-gray-800 mb-4">{{t('Our contact details')}}</h3>
      <ul class="space-y-2">
        <li>
          <a :href="`tel:${siteSettings.contact}`" class="text-gray-600 hover:text-primary">
            {{ t(siteSettings.contact) }}
          </a>
        </li>
        <li>
          <a :href="`mailto:${siteSettings.contact}`" class="text-gray-600 hover:text-primary">
            {{ t(siteSettings.contact) }}
          </a>
        </li>
        <li>
          <span class="text-gray-600">{{ t(siteSettings.address) }}</span>
        </li>
      </ul>
    </div>
<!-- Opening Hours -->
<div>
  <h3 class="text-xl font-bold text-gray-800 mb-4">{{ t('Opening hours') }}</h3>
  <ul class="space-y-1 text-gray-600 text-sm">
    <li v-for="day in siteSettings.openingHours" :key="day.day">
      <strong class="mr-2">{{ t(day.day) }}:</strong>

      <!-- Closed -->
      <span v-if="day.closed" class="text-red-500">{{ t('Closed') }}</span>

      <!-- 1 or 2 Shifts -->
      <template v-else>
        <!-- Single shift (old structure) -->
        <span v-if="!day.shifts">{{ day.open }} - {{ day.close }}</span>

        <!-- New structure with shifts -->
        <template v-else>
          <span>
            {{ day.shifts[0].open }} - {{ day.shifts[0].close }}
          </span>
          <span v-if="day.doubleShift && day.shifts[1]" class="ml-1">
            , {{ day.shifts[1].open }} - {{ day.shifts[1].close }}
          </span>
        </template>
      </template>
    </li>
  </ul>
</div>

  </div>

  <div class="mt-8 border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-4">
    <p class="text-gray-600">© {{ new Date().getFullYear() }} {{ t(siteSettings.siteName) }}. {{t('All rights reserved')}}.</p>
    <div class="flex space-x-4">
      <NuxtLink to="/privacy_policy" class="text-gray-600 hover:text-primary">{{t('Privacy Policy')}}</NuxtLink>
      <NuxtLink to="/terms" class="text-gray-600 hover:text-primary">{{t('Terms of Service')}}</NuxtLink> 
    </div>
  </div>
</footer>
</template>

<script setup>
import { useSiteSettings } from '~/composables/useSiteSettings'
const { siteSettings } = useSiteSettings()
const storeLanguage = useLanguageStore()
 
 const t = (key) => storeLanguage.t(key)

</script>
