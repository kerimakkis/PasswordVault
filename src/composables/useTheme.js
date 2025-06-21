import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  // Check localStorage for saved theme preference, default to light
  const isDark = ref(false) // Start with false, will be set in onMounted

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    updateTheme()
  }

  const updateTheme = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }

  const initializeTheme = () => {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      isDark.value = savedTheme === 'dark'
      updateTheme()
    }
  }

  // Initialize theme on mount
  onMounted(() => {
    initializeTheme()
  })

  // Watch for changes
  watch(isDark, () => {
    updateTheme()
  })

  return {
    isDark,
    toggleTheme
  }
} 