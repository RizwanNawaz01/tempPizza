<template>
  <NuxtLayout>   
    <NuxtPage />  
  </NuxtLayout>
</template>

<script setup>
import { watch } from 'vue'
import { useSiteSettings } from '@/composables/useSiteSettings'

const { siteSettings } = useSiteSettings()

watch(siteSettings, (settings) => {
  if (!settings) return

  // Meta title
  if (settings.metaTitle) document.title = settings.metaTitle

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) {
    metaDesc.setAttribute('content', settings.metaDescription || '')
  } else if (settings.metaDescription) {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = settings.metaDescription
    document.head.appendChild(meta)
  }

  // Favicon
  if (settings.favicon) {
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = settings.favicon
  }
})
</script>
