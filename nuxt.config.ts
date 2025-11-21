// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  sourcemap: false,
  
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild', // Faster than terser
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks to reduce initial load
            'vue-vendor': ['vue', 'vue-router'],
            'chart': ['chart.js', 'vue-chartjs'],
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@prisma/client']
    }
  },

  image: {
    provider: 'none',
    quality: 80, // Reduce quality slightly for better performance
  },

  nitro: {
    preset: 'node-server',
    minify: true, // Enable minification in production
    compress: true, // Enable compression
    
    // Optimize for production
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    
    // Completely externalize Prisma
    externals: {
      inline: []
    },
    alias: {
      '.prisma/client': './.prisma/client'
    },
    moduleSideEffects: ['@prisma/client'],
    rollupConfig: {
      external: ['@prisma/client', '.prisma/client']
    },
    
    // Limit concurrent builds
    experimental: {
      tasks: true
    }
  },

  // Build optimizations
  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
  },

  // Add this hook to force externalization
  hooks: {
    'nitro:config': (nitroConfig) => {
      nitroConfig.externals = nitroConfig.externals || {}
      
      if (!Array.isArray(nitroConfig.externals.inline)) {
        nitroConfig.externals.inline = []
      }

      nitroConfig.externals.inline = nitroConfig.externals.inline.filter(
        (i: string) => typeof i === 'string' && !i.includes('@prisma/client')
      )

      nitroConfig.rollupConfig = nitroConfig.rollupConfig || {}
      if (!Array.isArray(nitroConfig.rollupConfig.external)) {
        nitroConfig.rollupConfig.external = []
      }

      const external = nitroConfig.rollupConfig.external as string[]
      if (!external.includes('@prisma/client')) {
        external.push('@prisma/client')
      }
      if (!external.includes('.prisma/client')) {
        external.push('.prisma/client')
      }
    }
  },

  modules: ['@nuxt/image', '@nuxt/icon', '@pinia/nuxt'], 
  
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  },

  // Experimental features for better performance
  experimental: {
    payloadExtraction: false, // Disable if not using SSG
    renderJsonPayloads: true,
  },

  // Router optimizations
  router: {
    options: {
      strict: false
    }
  }
})