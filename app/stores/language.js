import { defineStore } from 'pinia'
import en from '@/locales/en.json'
import de from '@/locales/de.json'
import fr from '@/locales/fr.json'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    current: 'en',
    translations: { en, de, fr }
  }),
  getters: { 
    t: (state) => (key) => state.translations[state.current][key] || key
  },
  actions: {
    setLanguage(lang) {
      if (this.translations[lang]) {
        this.current = lang
        // only save in client
        if (process.client) localStorage.setItem('language', lang)
      }
    },
    loadLanguage() {
      if (process.client) {
        const saved = localStorage.getItem('language')
        if (saved && this.translations[saved]) {
          this.current = saved
        }
      }
      return this.current
    }
  }
})
