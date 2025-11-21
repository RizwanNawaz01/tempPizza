<template>
  <div class="min-h-screen flex flex-col pt-20"> 
    <Header/>
    <main class="flex-grow">
        <slot />
    </main>
    <Footer />
  </div>
</template>