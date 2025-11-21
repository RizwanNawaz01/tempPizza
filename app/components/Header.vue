<template>
  <header class="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
    <div class="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
      <!-- Logo -->
      <NuxtLink to="/" class="text-3xl font-extrabold text-primary">
          {{ siteName }}
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex space-x-6">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-lg font-medium text-gray-600 hover:text-white hover:bg-primary transition duration-300 px-3 py-2 rounded-lg"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Right Side Controls -->
      <div class="flex items-center space-x-4">
        <!-- Language Dropdown -->
        <div class="relative" ref="dropdownRef">
          <button
            @click.stop="toggleLanguageDropdown"
            class="flex items-center space-x-1 text-lg text-gray-600 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <span class="uppercase">{{ currentLanguage }}</span>
            <i class="fas fa-chevron-down text-sm"></i>
          </button>

          <div
            v-if="isLanguageOpen"
            class="absolute right-0 mt-2 w-20 bg-white rounded-lg shadow-lg py-2 z-50"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLanguage(lang)"
              class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary flex items-center justify-between cursor-pointer"
            >
              <Icon :name="lang.icon" class="w-5 h-5" />
              <span>{{ lang.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- Mobile Menu Toggle -->
        <button
          class="md:hidden text-2xl text-gray-600"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="Toggle navigation"
        >
          <Icon name="clarity:menu-line" class="mt-1" />
        </button>


        <!-- Delivery Zone Indicator -->
        <div v-if="deliveryStore.mode" class="hidden md:flex items-center space-x-1">
          <button
            @click="isPostalCodeOpen = true"
            class="flex items-center text-lg text-gray-700 hover:text-primary transition cursor-pointer"
          >
            <template v-if="deliveryStore.mode === 'pickup'">
              <Icon name="mdi:store-outline" class="w-5 h-5 mr-1" />
              <span class="capitalize"> {{ t('pickup')}} </span>
            </template>
            <template v-else>
              <Icon name="mdi:map-marker-outline" class="w-5 h-5 mr-1" />
              <span>{{ deliveryStore.fullAddress }}</span>
            </template>
          </button>
        </div>

        <!-- Login -->
        <div class="relative">
          <button
            v-if="authStore.isAuthenticated"
            @click="toggleDropdown"
            class="hidden sm:block text-lg text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer"
          >
            <span>👤</span>
            <span>{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span>
            <span>▼</span>
          </button>

          <button
            v-else
            @click="openLogin"
            class="hidden sm:block text-lg text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer"
          >
            {{ t('login') }}
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showDropdown && authStore.isAuthenticated"
            class="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div class="p-4 border-b border-gray-200">
              <p class="font-semibold">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
              <p class="text-sm text-gray-600">{{ authStore.user?.email }}</p>
            </div>
            <div class="flex flex-col">
              <NuxtLink
                to="/orders"
                @click.stop="toggleDropdown"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 text-black border-b border-gray-200 capitalize"
              > 
                {{ t('orders') }}
              </NuxtLink>
              <NuxtLink
                v-if="authStore.isAdminFunction"
                to="/admin/dashboard"
                @click.stop="toggleDropdown"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 text-black border-b border-gray-200 capitalize"
              >
                {{ t('admin panel') }}

              </NuxtLink>
            </div>

            <button
              @click="logout"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 capitalize"
            >
                {{ t('logout') }}              
            </button>
          </div>
        </div>

        <!-- Cart -->
        <button
          class="relative text-2xl text-primary hover:text-primary/80 cursor-pointer"
          aria-label="Open cart"
          @click.stop="toggleCart"
        >
          <Icon name="clarity:shopping-cart-line" />
          <span
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cart.totalItems }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="fade">
      <nav
        v-if="isMenuOpen"
        class="md:hidden bg-white border-t border-gray-200 py-4 px-6 space-y-3"
      >
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="block text-lg font-medium text-gray-700 hover:bg-primary hover:text-white rounded-lg px-3 py-2 transition"
          @click="isMenuOpen = false"
        >
          {{ link.label }}
        </a>
      </nav>
    </transition>
  </header>

  <!-- Modals -->
  <Cart :isCartOpen="isCartOpen" @closeCart="toggleCart" />
  <LoginModal
    :isLoginOpen="isLoginOpen"
    @closeLogin="isLoginOpen = false"
    @openSignup="openSignup"
    @openForget="openForget"
  />
  <SignupModal
    :isSignupOpen="isSignupOpen"
    @closeSignup="isSignupOpen = false"
    @openLogin="openLogin"
  />
  <ForgetModal
    :isForgetOpen="isForgetOpen"
    @closeForget="isForgetOpen = false"
    @openLogin="openLogin"
  />
  <PostalCodeModal
    :isPostalCodeOpen="isPostalCodeOpen"
    @closePostalCode="isPostalCodeOpen = false"
    @savePostalCode="handlePostalSave"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted,watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDeliveryStore } from '@/stores/delivery'
import { useSiteSettings } from '@/composables/useSiteSettings' 
import { useLanguageStore } from '@/stores/language'

const router = useRouter()
const authStore = useAuthStore()
const deliveryStore = useDeliveryStore()
const cart = useCartStore()
const siteName = ref('Foodly') // default fallback
const navLinks = ref([]) // default fallback
const storeLanguage = useLanguageStore()

const showDropdown = ref(false)
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const isLoginOpen = ref(false)
const isSignupOpen = ref(false)
const isForgetOpen = ref(false)
const isPostalCodeOpen = ref(false)
const isLanguageOpen = ref(false)
const currentLanguage = ref('en')
const dropdownRef = ref(null)
const { siteSettings } = useSiteSettings()


 
const t = (key) => storeLanguage.t(key)

currentLanguage.value = storeLanguage.loadLanguage()

const languages = [
  { code: 'de', name: 'DE', icon: 'flag:de-1x1' },
  { code: 'en', name: 'EN', icon: 'flag:gb-1x1' },
  { code: 'fr', name: 'FR', icon: 'flag:fr-1x1' },
]

const selectLanguage = (lang) => {
  currentLanguage.value = lang.name
  isLanguageOpen.value = false
  storeLanguage.setLanguage(lang.code) 
}
const toggleLanguageDropdown = () => (isLanguageOpen.value = !isLanguageOpen.value)
const closeLanguageDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isLanguageOpen.value = false
  }
}

const toggleCart = () => (isCartOpen.value = !isCartOpen.value)
const openSignup = () => {
  isSignupOpen.value = true
  isLoginOpen.value = false
}
const openLogin = () => {
  isLoginOpen.value = true
  isSignupOpen.value = false
}
const openForget = () => {
  isForgetOpen.value = true
  isLoginOpen.value = false
  isSignupOpen.value = false
}

const toggleDropdown = () => (showDropdown.value = !showDropdown.value)

const logout = async () => {
  try {
    await authStore.logout()
    showDropdown.value = false
    router.go(0)
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

const handlePostalSave = (data) => {
  if (data.mode === 'pickup') {
    deliveryStore.setPickup()
  } else {
    deliveryStore.setDelivery(data.city, data.postalCode)
  }
  isPostalCodeOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeLanguageDropdown)
  deliveryStore.loadFromLocal()

  // open modal only if user hasn’t selected yet
  if (!deliveryStore.mode) {
    isPostalCodeOpen.value = true
  } 
})
 

onUnmounted(() => {
  document.removeEventListener('click', closeLanguageDropdown)
})

// Dynamically set meta title
watch(siteSettings, (settings) => {
  if (settings?.metaTitle) { 
    siteName.value = settings.siteName
  }
    if (settings?.services) { 
       navLinks.value = settings.services.map(service => ({
          href: `${service.description}`,
          label: t(service.name)
        })) 

    }

})


</script>
