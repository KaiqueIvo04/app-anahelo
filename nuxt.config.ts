import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true,
  runtimeConfig: {
    public: {
      apiBase: '/api/testes',
      defaultTheme: 'valentine',
      darkTheme: 'dark',
      nodeEnv: 'development'
    },
  },
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