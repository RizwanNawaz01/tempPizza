<template>
        <Hero /> 
        <HighlightedMenu  /> 
        <MenuList @openSubMenu="toggleSubMenu"  /> 
        <AboutUs /> 
        <Reviews />  

      <MenuOptionsModal 
    v-if="isSubMenuOpen" 
    :menu-item="selectedMenuItem" 
    @close="isSubMenuOpen = false"
  />

</template>

<script setup> 
import { ref } from 'vue'
const isSubMenuOpen = ref(false)
const selectedMenuItem = ref(null)

const toggleSubMenu = (menuItem) => { 
  selectedMenuItem.value = menuItem
  isSubMenuOpen.value = true
}

</script>
