<template>
<section id="home" class="pt-5 md:pt-20 pb-0 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">

  <div  class="app-container">
  
      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center h-80">
        <span class="text-lg font-semibold text-primary">Loading slides...</span>
      </div>

      <!-- Slider -->
    <div v-else  class="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
      <div class="flex flex-col">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary mb-3"> {{ t(slides[currentSlide]?.title || '')  }}<br class="hidden sm:block">
           
        </h2>
        <p class="text-base md:text-lg text-primary/90 max-w-prose"> {{ t(slides[currentSlide]?.subtitle || '')  }}</p>
       <div
          class="relative rounded-2xl overflow-hidden shadow-lg mt-6 sm:mt-8 w-full max-w-xl text-white transition-all duration-700 ease-in-out"
        :style="{ backgroundImage: slides[currentSlide]?.gradident?.trim().replace(/;$/, '') || 'none' }" 
        > 
          <div class="p-4 sm:p-5 text-center transition-opacity duration-700 ease-in-out">
            <h3 class="text-base sm:text-lg md:text-xl font-semibold mb-1">
              {{ t(slides[currentSlide]?.smallTitle || '') }}
            </h3>
            <p class="text-xs sm:text-sm mb-2">
              {{ t(slides[currentSlide]?.smallSubtitle || '')  }}
            </p>
            <a
              :href="slides[currentSlide]?.link || ''"
              class="inline-block bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-gray-100 transition"
            >{{ t(slides[currentSlide]?.linkName || '') }}
            </a>
          </div>
        </div>
      </div>
      <div class="relative w-full h-[360px] lg:h-[420px]">
          <NuxtImg
          v-for="(slide, index) in slides"
          :key="index"
          :src="slide.image"
          alt="Food slideshow"
          loading="lazy"
          class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[70%] max-w-[420px] h-auto rounded-2xl object-cover shadow-xl transition-opacity duration-1000"
          :class="currentSlide  === index ? 'opacity-100' : 'opacity-0'"
        /> 
  </div>
    </div>
  </div>
</section>

</template>
<script setup>
import { ref, onMounted, onBeforeUnmount,watch  } from 'vue'
 
const slides = ref([]) 
const currentSlide = ref(0)
const loading = ref(true) // <-- loader state
const storeLanguage = useLanguageStore()
 
 const t = (key) => storeLanguage.t(key)


async function fetchSliders() {
  try {
     const data = await $fetch('/api/admin/slider')
    slides.value = data
    
  } catch (error) {
    console.error('Failed to fetch sliders:', error)
  }finally {
    loading.value = false // <-- hide loader once fetched
  }
}
 let interval = null

onMounted(async  () => {  
 await  fetchSliders()

   if (slides.value.length === 0) return // no slides, don't start interval

  interval = setInterval(() => { 
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  }, 3000) 

  
})
watch(slides, (newSlides) => {
  if (newSlides.length === 0) currentSlide.value = 0
  else currentSlide.value %= newSlides.length
})
onBeforeUnmount(() => {
  clearInterval(interval)
})

  
</script>