export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    isAuthenticated: false,
    isAdmin: false,
  }),

  actions: {
    async signup(userData: any) {
      try {
        const { data } = await $fetch('/api/auth/signup', {
          method: 'POST',
          body: userData
        })
        
        this.user = data.user
        this.isAuthenticated = true
        return data
      } catch (error) {
        throw error
      }
    },

    async login(credentials: { email: string; password: string }) {
      try {
        const { data } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        this.user = data.user
        this.isAuthenticated = true
        return data
      } catch (error) {
        throw error
      }
    },

    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.user = null
      this.isAuthenticated = false
    },

    async fetchUser() {
      try {
        const { data } = await $fetch('/api/auth/me')
        this.user = data.user
        this.isAuthenticated = true
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
      }
    },

    
    async isAdminFunction() {
      try {
        const { data } = await $fetch('/api/auth/me')
        if(data.user.userType  == 'admin'){
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
            
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        this.isAdmin = false
      }
    }
  },

  persist: true
})