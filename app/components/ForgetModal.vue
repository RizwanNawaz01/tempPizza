<template>
<div :class="isForgetOpen?'':'hidden'"  class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
  <div ref="ModalRef" class="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
    <h2 class="text-xl font-semibold mb-4">Passwort zurücksetzen</h2>
    <button class="absolute top-5 right-4 text-gray-500 hover:text-gray-700 cursor-pointer" @click="emit('closeForget')">✕</button>
    <form class="space-y-3">
        <input placeholder="Ihre E-Mail" required="" class="w-full border p-2 rounded" autocomplete="email" type="email" value="">
        <button type="submit" class="w-full bg-primary text-white py-2 rounded disabled:opacity-60">Code senden</button>
        <button type="button" class="text-sm text-gray-600 underline mt-2 cursor-pointer"   @click="switchToLogin">Zurück zum Login</button>
    </form>
    <button class="text-sm text-gray-500 mt-4 hover:underline block mx-auto cursor-pointer"  @click="emit('closeForget')">Abbrechen</button>
  </div>
</div>
</template>

<script setup>
const props = defineProps({
  isForgetOpen: {
    type: Boolean,
    required: true
  }
}) 

const emit = defineEmits(['closeForget','openForget','openLogin']);
const ModalRef = ref(null) 
 
const switchToLogin = () => {
  emit('openLogin');
  emit('closeForget');
};

// Handle outside clicks
const handleClickOutside = (event) => {
  if (ModalRef.value && !ModalRef.value.contains(event.target)) {
    if(props.isForgetOpen){
        emit('closeForget')
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

</script>