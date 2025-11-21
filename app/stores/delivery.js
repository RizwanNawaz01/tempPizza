import { defineStore } from 'pinia'

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    mode: null, // 'delivery' or 'pickup'
    city: null,
    postalCode: null,
  }),

  getters: {
    fullAddress: (state) => {
      if (state.mode === 'pickup') return 'Pickup'
      if (state.city && state.postalCode) return `${state.postalCode}, ${state.city}`
      return null
    },
  },

  actions: {
    setDelivery(city, postalCode) {
      this.mode = 'delivery'
      this.city = city
      this.postalCode = postalCode
      this.saveToLocal()
    },

    setPickup() {
      this.mode = 'pickup'
      this.city = null
      this.postalCode = null
      this.saveToLocal()
    },

    clear() {
      this.mode = null
      this.city = null
      this.postalCode = null
      localStorage.removeItem('delivery')
    },

    saveToLocal() {
      localStorage.setItem(
        'delivery',
        JSON.stringify({
          mode: this.mode,
          city: this.city,
          postalCode: this.postalCode,
        })
      )
    },

    loadFromLocal() {
      const data = localStorage.getItem('delivery')
      if (data) {
        const parsed = JSON.parse(data)
        this.mode = parsed.mode
        this.city = parsed.city
        this.postalCode = parsed.postalCode
      }
    },
  },
})
