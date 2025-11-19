import { ref, computed } from 'vue'
import generatePassword from 'password-generator'

// Custom password generator function
const generateCustomPassword = (length, options) => {
  let charset = ''

  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.numbers) charset += '0123456789'
  if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!charset) {
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  }

  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return password
}

/**
 * Composable for generating secure passwords.
 * @returns {Object} Password generation state and methods.
 */
export function usePasswordGenerator() {
  // State
  const passwordLength = ref(16)
  const includeNumbers = ref(true)
  const includeSymbols = ref(true)
  const includeUppercase = ref(true)
  const includeLowercase = ref(true)
  const excludeSimilarChars = ref(false)
  const useMemorable = ref(false)
  const generatedPassword = ref('')
  const passwordStrength = ref('')
  const passwordHistory = ref([])

  // Computed
  const passwordOptions = computed(() => ({
    length: passwordLength.value,
    numbers: includeNumbers.value,
    symbols: includeSymbols.value,
    uppercase: includeUppercase.value,
    lowercase: includeLowercase.value,
    excludeSimilarCharacters: excludeSimilarChars.value
  }))

  const strengthScore = computed(() => {
    if (!generatedPassword.value) return 0

    let score = 0
    const password = generatedPassword.value

    // Length bonus
    score += Math.min(password.length * 4, 25)

    // Character variety bonus
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/[0-9]/.test(password)) score += 10
    if (/[^A-Za-z0-9]/.test(password)) score += 15

    // Deduct for repeated characters
    const repeatedChars = (password.match(/(.)\1+/g) || []).length
    score -= repeatedChars * 5

    return Math.max(0, Math.min(100, score))
  })

  const strengthLabel = computed(() => {
    const score = strengthScore.value
    if (score >= 80) return { text: 'Çok Güçlü', color: 'text-green-500', bg: 'bg-green-100' }
    if (score >= 60) return { text: 'Güçlü', color: 'text-blue-500', bg: 'bg-blue-100' }
    if (score >= 40) return { text: 'Orta', color: 'text-yellow-500', bg: 'bg-yellow-100' }
    if (score >= 20) return { text: 'Zayıf', color: 'text-orange-500', bg: 'bg-orange-100' }
    return { text: 'Çok Zayıf', color: 'text-red-500', bg: 'bg-red-100' }
  })

  // Methods
  /**
   * Generates a new password based on current settings.
   * @returns {string} The generated password.
   */
  const generateNewPassword = () => {
    try {
      if (useMemorable.value) {
        // Try to use library for memorable passwords
        try {
          generatedPassword.value = generatePassword(passwordLength.value, true)
        } catch (error) {
          // Fallback to custom memorable password
          const words = ['apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'house', 'island', 'jungle', 'knight', 'lemon', 'mountain', 'ocean', 'planet', 'queen', 'river', 'sunset', 'tiger', 'umbrella', 'village', 'window', 'xylophone', 'yellow', 'zebra']
          let memorablePassword = ''
          for (let i = 0; i < Math.ceil(passwordLength.value / 5); i++) {
            memorablePassword += words[Math.floor(Math.random() * words.length)]
          }
          generatedPassword.value = memorablePassword.substring(0, passwordLength.value)
        }
      } else {
        // Use our custom password generator
        generatedPassword.value = generateCustomPassword(passwordLength.value, passwordOptions.value)
      }

      // Add to history (keep last 10)
      if (generatedPassword.value && !passwordHistory.value.includes(generatedPassword.value)) {
        passwordHistory.value.unshift(generatedPassword.value)
        passwordHistory.value = passwordHistory.value.slice(0, 10)
      }

      return generatedPassword.value
    } catch (error) {
      console.error('Password generation error:', error)
      // Final fallback
      const fallbackChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let fallbackPassword = ''
      for (let i = 0; i < passwordLength.value; i++) {
        fallbackPassword += fallbackChars.charAt(Math.floor(Math.random() * fallbackChars.length))
      }
      generatedPassword.value = fallbackPassword
      return fallbackPassword
    }
  }

  /**
   * Copies the generated password to clipboard.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const copyToClipboard = async () => {
    if (!generatedPassword.value) return false

    try {
      await navigator.clipboard.writeText(generatedPassword.value)
      return true
    } catch (error) {
      console.error('Clipboard error:', error)
      return false
    }
  }

  const clearHistory = () => {
    passwordHistory.value = []
  }

  const regeneratePassword = () => {
    return generateNewPassword()
  }

  // Presets
  /**
   * Applies a predefined password generation preset.
   * @param {string} preset - The preset name ('strong', 'memorable', 'simple', 'pin').
   */
  const applyPreset = (preset) => {
    switch (preset) {
      case 'strong':
        passwordLength.value = 20
        includeNumbers.value = true
        includeSymbols.value = true
        includeUppercase.value = true
        includeLowercase.value = true
        excludeSimilarChars.value = false
        useMemorable.value = false
        break
      case 'memorable':
        passwordLength.value = 24
        includeNumbers.value = true
        includeSymbols.value = false
        includeUppercase.value = true
        includeLowercase.value = true
        excludeSimilarChars.value = true
        useMemorable.value = true
        break
      case 'simple':
        passwordLength.value = 12
        includeNumbers.value = true
        includeSymbols.value = false
        includeUppercase.value = true
        includeLowercase.value = true
        excludeSimilarChars.value = false
        useMemorable.value = false
        break
      case 'pin':
        passwordLength.value = 6
        includeNumbers.value = true
        includeSymbols.value = false
        includeUppercase.value = false
        includeLowercase.value = false
        excludeSimilarChars.value = false
        useMemorable.value = false
        break
    }
    generateNewPassword()
  }

  return {
    // State
    passwordLength,
    includeNumbers,
    includeSymbols,
    includeUppercase,
    includeLowercase,
    excludeSimilarChars,
    useMemorable,
    generatedPassword,
    passwordStrength,
    passwordHistory,

    // Computed
    passwordOptions,
    strengthScore,
    strengthLabel,

    // Methods
    generateNewPassword,
    copyToClipboard,
    clearHistory,
    regeneratePassword,
    applyPreset
  }
} 