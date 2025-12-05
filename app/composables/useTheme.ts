// import { useLoggedUserStore } from "~/stores/userLogged.store"
// import { Theme } from "~/types/enums/theme.enum"

// const loggedUserStore = useLoggedUserStore()

// export const useTheme = () => {
//   const theme = useState<string>('theme', () => {
//     if (import.meta.client) {
//       return loggedUserStore.getTheme() || Theme.LIGHT
//     }
//     return defaultTheme
//   })

//   function setTheme(newTheme: string) {
//     theme.value = newTheme
    
//     if (import.meta.client) {
//       document.documentElement.setAttribute('data-theme', newTheme)
      
//       localStorage.setItem('theme', newTheme)
//     }
//   }

//   function toggleTheme() {
//     const newTheme = theme.value === defaultTheme ? darkTheme : defaultTheme
//     setTheme(newTheme)
//   }

//   return {
//     theme: readonly(theme),
//     setTheme,
//     toggleTheme
//   }
// }