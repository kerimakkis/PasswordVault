import { ref, watch, onMounted, onUnmounted } from 'vue'

/**
 * Composable for managing application theme (dark/light mode).
 * @returns {Object} Theme state and toggle function.
 */
export function useTheme() {
  // Check localStorage for saved theme preference, default to light
  const isDark = ref(false) // Start with false, will be set in onMounted

  /**
   * Toggles the theme between dark and light.
   * Saves preference to localStorage.
   */
  const toggleTheme = () => {
    isDark.value = !isDark.value
    // Save the user's explicit choice to localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    updateTheme()
  }

  const updateTheme = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }

  const initializeTheme = () => {
    if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')

      if (savedTheme) {
        // Use the saved theme if it exists
        isDark.value = savedTheme === 'dark'
      } else {
        // Otherwise, use the system preference
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      updateTheme()
    }
  }

  // Listener for system theme changes
  const mediaQueryListener = (e) => {
    // Only apply system theme if no manual choice has been made
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
      updateTheme()
    }
  }

  // Initialize theme on mount
  onMounted(() => {
    initializeTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', mediaQueryListener)
  })

  onUnmounted(() => {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', mediaQueryListener)
  })

  // Watch for manual changes to isDark (from toggleTheme)
  watch(isDark, () => {
    updateTheme()
  })

  return {
    isDark,
    toggleTheme
  }
}