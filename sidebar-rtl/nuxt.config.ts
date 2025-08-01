import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    'motion-v/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-lucide-icons',
    '@nuxtjs/google-fonts',
    'dayjs-nuxt',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    'shadcn-nuxt',
  ],
  ssr: false,
  devtools: { enabled: false },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      viewport: 'width=device-width,initial-scale=1',
      htmlAttrs: {
        dir: 'rtl',
        lang: 'fa-IR',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  css: [
    '~/assets/styles/app.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    baseApi: '',
    public: {
      baseStorage: '',
    },
  },
  routeRules: {
    // TODO un Comment on production
    // '/auth/**': { appMiddleware: 'should-be-logged-out' },
    '/': { redirect: '/dashboard' },
    // '/dashboard': { appMiddleware: 'should-be-logged-in' },
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  dayjs: {
    plugins: ['relativeTime', 'timezone', 'weekday'],
  },
  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
  googleFonts: {
    families: {
      Inter: [400, 500],
      Comfortaa: [400, 500, 600],
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true,
  },

})
