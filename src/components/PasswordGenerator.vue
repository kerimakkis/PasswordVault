<template>
  <div class="password-generator">
    <!-- Header -->
    <div class="generator-header">
      <h2 class="generator-title">
        <i class="fas fa-key"></i>
        Şifre Üretici
      </h2>
      <div class="generator-actions">
        <button
          @click="generateNewPassword"
          class="btn btn-primary"
        >
          <i class="fas fa-sync-alt"></i>
          Yeni Şifre
        </button>
      </div>
    </div>

    <!-- Generated Password Display -->
    <div class="password-display-section">
      <div class="password-input-wrapper">
        <input
          :value="generatedPassword"
          readonly
          class="password-input"
          placeholder="Şifre üretmek için 'Yeni Şifre' butonuna tıklayın"
        />
        <button
          @click="copyPassword"
          class="copy-button"
          :title="copySuccess ? 'Kopyalandı!' : 'Kopyala'"
        >
          <i :class="copySuccess ? 'fas fa-check' : 'fas fa-copy'"></i>
        </button>
      </div>
      
      <!-- Password Strength Indicator -->
      <div v-if="generatedPassword" class="strength-indicator">
        <div class="strength-header">
          <span class="strength-label">
            Şifre Gücü:
          </span>
          <span :class="`strength-text ${strengthLabel.color}`">
            {{ strengthLabel.text }}
          </span>
        </div>
        <div class="strength-bar">
          <div
            :class="`strength-fill ${strengthScore >= 80 ? 'strength-excellent' :
              strengthScore >= 60 ? 'strength-good' :
              strengthScore >= 40 ? 'strength-fair' :
              strengthScore >= 20 ? 'strength-poor' : 'strength-weak'}`"
            :style="{ width: `${strengthScore}%` }"
          ></div>
        </div>
        <div class="strength-score">
          Skor: {{ strengthScore }}/100
        </div>
      </div>
    </div>

    <!-- Preset Buttons -->
    <div class="preset-section">
      <h3 class="section-title">
        Hızlı Ayarlar
      </h3>
      <div class="preset-grid">
        <button
          @click="applyPreset('strong')"
          class="btn btn-sm preset-btn preset-strong"
        >
          <i class="fas fa-shield-alt"></i>
          Güçlü
        </button>
        <button
          @click="applyPreset('memorable')"
          class="btn btn-sm preset-btn preset-memorable"
        >
          <i class="fas fa-brain"></i>
          Hatırlanabilir
        </button>
        <button
          @click="applyPreset('simple')"
          class="btn btn-sm preset-btn preset-simple"
        >
          <i class="fas fa-star"></i>
          Basit
        </button>
        <button
          @click="applyPreset('pin')"
          class="btn btn-sm preset-btn preset-pin"
        >
          <i class="fas fa-mobile-alt"></i>
          PIN
        </button>
      </div>
    </div>

    <!-- Password Length Setting -->
    <div class="settings-section">
      <div class="setting-group">
        <label class="setting-label">
          Şifre Uzunluğu: {{ passwordLength }}
        </label>
        <input
          v-model="passwordLength"
          type="range"
          min="4"
          max="64"
          class="length-slider"
        />
        <div class="length-labels">
          <span>4</span>
          <span>64</span>
        </div>
      </div>
    </div>

    <!-- Password History -->
    <div v-if="passwordHistory.length > 0" class="history-section">
      <div class="history-header">
        <h3 class="section-title">
          Son Şifreler
        </h3>
        <button
          @click="clearHistory"
          class="btn btn-sm btn-danger"
        >
          <i class="fas fa-trash"></i>
          Temizle
        </button>
      </div>
      <div class="history-list">
        <div
          v-for="(password, index) in passwordHistory"
          :key="index"
          class="history-item"
        >
          <span class="history-password">
            {{ password }}
          </span>
          <button
            @click="copySpecificPassword(password)"
            class="copy-history-btn"
            title="Kopyala"
          >
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePasswordGenerator } from '../composables/usePasswordGenerator'

// Emit tanımla
const emit = defineEmits(['passwordGenerated'])

const {
  passwordLength,
  generatedPassword,
  passwordHistory,
  strengthScore,
  strengthLabel,
  generateNewPassword,
  copyToClipboard,
  clearHistory,
  applyPreset
} = usePasswordGenerator()

const copySuccess = ref(false)

const copyPassword = async () => {
  const success = await copyToClipboard()
  if (success) {
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

const copySpecificPassword = async (password) => {
  try {
    await navigator.clipboard.writeText(password)
    // Show success feedback
  } catch (error) {
    console.error('Clipboard error:', error)
  }
}

// Şifreyi dashboard'a gönder
const sendToDashboard = () => {
  if (generatedPassword.value) {
    emit('passwordGenerated', generatedPassword.value)
  }
}

onMounted(() => {
  // Generate initial password
  generateNewPassword()
})

// Watch for password changes and emit
watch(generatedPassword, (newPassword) => {
  if (newPassword) {
    emit('passwordGenerated', newPassword)
  }
})
</script>

<style scoped>
.password-generator {
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  height: fit-content;
}

.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.generator-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.generator-title i {
  color: var(--color-primary);
}

.generator-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.password-display-section {
  margin-bottom: var(--spacing-lg);
}

.password-input-wrapper {
  position: relative;
  margin-bottom: var(--spacing-md);
}

.password-input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1.125rem;
  font-family: 'Courier New', monospace;
  background-color: var(--bg-input);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  transition: border-color var(--transition-fast);
}

.password-input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.copy-button {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  padding: var(--spacing-sm);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.copy-button:hover {
  color: var(--color-primary);
}

.strength-indicator {
  margin-top: var(--spacing-md);
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.strength-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.strength-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.strength-text.text-success { color: var(--color-success); }
.strength-text.text-warning { color: var(--color-warning); }
.strength-text.text-danger { color: var(--color-danger); }

.strength-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.strength-fill {
  height: 100%;
  transition: width var(--transition-normal);
}

.strength-excellent { background-color: var(--color-success); }
.strength-good { background-color: var(--color-primary); }
.strength-fair { background-color: var(--color-warning); }
.strength-poor { background-color: var(--color-warning); }
.strength-weak { background-color: var(--color-danger); }

.strength-score {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.preset-section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.preset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.preset-strong {
  background-color: var(--color-success);
  color: var(--text-inverse);
  border-color: var(--color-success);
}

.preset-memorable {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  border-color: var(--color-primary);
}

.preset-simple {
  background-color: var(--color-warning);
  color: var(--text-inverse);
  border-color: var(--color-warning);
}

.preset-pin {
  background-color: var(--color-secondary);
  color: var(--text-inverse);
  border-color: var(--color-secondary);
}

.settings-section {
  margin-bottom: var(--spacing-lg);
}

.setting-group {
  margin-bottom: var(--spacing-lg);
}

.setting-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.length-slider {
  width: 100%;
  height: 6px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  outline: none;
  -webkit-appearance: none;
  margin-bottom: var(--spacing-xs);
}

.length-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background-color: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--bg-card);
  box-shadow: var(--shadow-sm);
}

.length-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background-color: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--bg-card);
  box-shadow: var(--shadow-sm);
}

.length-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.history-section {
  border-top: 1px solid var(--border-primary);
  padding-top: var(--spacing-lg);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.history-list {
  max-height: 160px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xs);
}

.history-password {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-all;
}

.copy-history-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.copy-history-btn:hover {
  color: var(--color-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .preset-grid {
    grid-template-columns: 1fr;
  }
  
  .generator-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}
</style> 