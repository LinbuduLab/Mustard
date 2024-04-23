export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  nitro: {
    prerender: {
      // Workaround for "Error: [404] Page not found: /manifest.json"
      failOnError: false,
    },
  },
})
