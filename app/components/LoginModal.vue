<template>
<div :class="isLoginOpen?'':'hidden'"  class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
  <div  ref="ModalRef" class="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
    <h2 class="text-xl font-semibold mb-4">Login</h2>
    <button class="absolute top-5 right-4 text-gray-500 hover:text-gray-700 cursor-pointer" @click="emit('closeLogin')">✕</button>

    <form class="space-y-4"  @submit.prevent="handleSubmit">
      <input v-model="form.email" placeholder="E-Mail" required="" class="w-full border border-gray-300 p-2 rounded" autocomplete="email" type="text"  name="email">
      <div class="relative">
        <input  v-model="form.password"  ref="passwordInput" placeholder="Passwort"  required="" class="w-full border border-gray-300 p-2 rounded pr-20" autocomplete="current-password" :type="showPasswordField ? 'text' : 'password'"  name="password">
        <button   @click="togglePassword" type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100" aria-label="Passwort  {{ showPasswordField ? 'Verbergen' : 'Anzeigen' }}"> {{ showPasswordField ? 'Verbergen' : 'Anzeigen' }}</button>
      </div>
      <button type="submit" class="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition disabled:opacity-60">Einloggen</button>
      <div class="mt-4 text-sm text-center">
        <p class="mb-2">
          <button type="button" class="text-primary hover:underline cursor-pointer"  @click="emit('openForget')">Passwort vergessen?</button>
        </p>
        <p>Noch kein Konto? <button type="button" class="text-primary hover:underline cursor-pointer"  @click="switchToSignup">Jetzt registrieren</button>
        </p>
      </div>
    </form>
    <button class="text-sm text-gray-500 mt-4 hover:underline block mx-auto cursor-pointer"  @click="emit('closeLogin')">Abbrechen</button>
  </div>
</div>
</template>

<script setup>

const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)


const handleSubmit = async () => {
  isLoading.value = true
  try {
    await authStore.login(form.value)
    emit('closeLogin')
    // Show success message or redirect
  } catch (error) {
    // Handle error (show toast message)
    console.error('Signup failed:', error)
  } finally {
    isLoading.value = false
  }
}



const props = defineProps({
  isLoginOpen: {
    type: Boolean,
    required: true
  }
}) 

const emit = defineEmits(['closeLogin', 'openSignup','openForget']);
const showPasswordField = ref(false)
const passwordInput = ref(null)
 
const ModalRef = ref(null) 

// Handle outside clicks
const handleClickOutside = (event) => {
  if (ModalRef.value && !ModalRef.value.contains(event.target)) {
    if(props.isLoginOpen){
        emit('closeLogin')
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const switchToSignup = () => {
  emit('closeLogin');
  emit('openSignup');
};

const togglePassword = () => {
  showPasswordField.value = !showPasswordField.value
  nextTick(() => {
    passwordInput.value?.focus()
  })
}


</script>