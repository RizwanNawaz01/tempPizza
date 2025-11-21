import { ref, onMounted } from 'vue'

export const siteSettings = ref(null)

export function useSiteSettings() {
  const fetchSettings = async () => {
    try {
      const data = await $fetch('/api/admin/settings')
      siteSettings.value = data
    } catch (err) {
      console.error('Failed to fetch site settings:', err)
    }
  }

  onMounted(fetchSettings)

  return { siteSettings }
}
