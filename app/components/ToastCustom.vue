<template>
  <transition name="fade">
    <div  v-if="show" class="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
      {{message}}
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  duration: {
    type: Number,
    default: 3000
  }
})

const show = ref(false)

watch(
  () => props.message,
  (msg) => {
    if (msg) {
      show.value = true
      setTimeout(() => {
        show.value = false
      }, props.duration)
    }
  }
)
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
