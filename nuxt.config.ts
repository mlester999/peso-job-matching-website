// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '~/assets/scss/_app.scss'],
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    vue: {
      // Enable Vue 2 compatibility mode
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2, // Enable Vue 2 compatibility
          },
        },
      },
    },
  },
})
