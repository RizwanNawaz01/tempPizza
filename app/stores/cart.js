import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    deliveryType: 'lieferung'
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
  },

  actions: {
    addToCart(product) {
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    decreseToCart(product){
      const existing = this.items.find(i => i.id === product.id)  
      if (existing && existing.quantity > 1) {
        existing.quantity--
      } else {
        this.removeFromCart(product.id)
      }
    },
    removeFromCart(id) {
      this.items = this.items.filter(i => i.id !== id)
    },
    clearCart() {
      this.items = []
    },
    setDeliveryType(type) {
      this.deliveryType = type
    },
    updateItemNote(id, note) {
        const item = this.items.find((i) => i.id === id)
        if (item) {
          item.note = note 
        }
      }
  },

  persist: true
})
