<template>
  <input
    ref="phoneRef"
    type="tel"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    placeholder="Enter Phone No."
    class="px-4 py-2.5 bg-white border w-full border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'

const props = defineProps({
  modelValue: String
})
const phoneRef = ref<HTMLInputElement>()

onMounted(() => {
  if (phoneRef.value) {
    intlTelInput(phoneRef.value, {
      initialCountry: 'auto',
      geoIpLookup: function (success) {
        fetch('https://ipinfo.io/json?token=<YOUR_TOKEN>')
          .then(res => res.json())
          .then(data => success(data.country))
          .catch(() => success('US'))
      },
      utilsScript:
        'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js'
    })
  }
})
</script>


<style>
.iti{
    display: block;
}
</style>