import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  runtimeConfig: {
    public: {
      apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
      defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'light',
    },
  },
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/main.css'],
  routeRules: {
    '/': { redirect: '/signin' }
  },
  app: {
    head: {
      title: "AnaHelo",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons"
        }
      ]
    }
  },
});