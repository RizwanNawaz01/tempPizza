<template>
   <section id="review" class="py-16 px-4 sm:px-6 lg:px-8 bg-white">
  <div class="app-container">
    <div class="mx-auto max-w-7xl">
      <h3 class="text-center text-base sm:text-lg font-semibold text-secondary">
        {{t('Customer reviews')}}        
      </h3>
      <h1 class="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-primary uppercase mt-1 mb-8">
        {{t('What our guests say')}}        
      </h1>
         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="(review, index) in reviews"
          :key="index"
          class="h-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative"
        >
        <Icon name="material-symbols:format-quote-rounded" class="fas fa-quote-right text-3xl text-gray-200 absolute top-4 right-4"/>

          <header class="flex items-center gap-4 mb-4">
            <NuxtImg
              :src="review.image"
              :alt="review.name"
              class="w-14 h-14 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <h3 class="text-lg font-semibold text-primary">{{ review.name }}</h3>
              <div class="flex">
                <Icon
                  v-for="n in review.rating"
                  :key="n"
                  name="material-symbols:kid-star-sharp"
                  class="text-primary text-sm"
                />
              </div>
            </div>
          </header>

          <p class="text-sm sm:text-base leading-6 text-primary">
            {{ review.text }}
          </p>
        </article>
      </div>
    </div>
  </div>
</section>
</template>

<script setup>

const storeLanguage = useLanguageStore()
 
 const t = (key) => storeLanguage.t(key)

const reviews = [
  {
    name: t('Gabi Shär'),
    image: '/images/reviews/pic-2.png',
    rating: 5,
    text: t('Very, very friendly service, excellent food, everything freshly prepared. The kitchen was impressive the second time around, too!')
  },
  {
    name:  t('Kevin Patrick Zollinger'),
    image: '/images/reviews/pic-3.png',
    rating: 5,
    text: t('Best snack bar in the region! Always recommended and great quality!')
  },
  {
    name:  t('Nadya Wolflisberg'),
    image: '/images/reviews/pic-2.png',
    rating: 5,
    text: t('Despite a large order, the delivery was on time and correct. Fresh, good, and highly recommended.')
  }, 
]
</script>