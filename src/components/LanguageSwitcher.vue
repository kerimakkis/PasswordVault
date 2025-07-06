<template>
  <div class="language-switcher">
    <div class="flag-buttons">
      <button 
        v-for="locale in locales" 
        :key="locale.code"
        @click="changeLanguage(locale.code)"
        class="flag-button"
        :class="{ active: locale.code === currentLocaleCode }"
        :title="locale.name"
      >
        <img :src="locale.flag" :alt="locale.name" class="flag" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLocale, getCurrentLocale } from '../i18n';
import trFlag from '../assets/flags/tr.svg';
import enFlag from '../assets/flags/en.svg';
import deFlag from '../assets/flags/de.svg';
import esFlag from '../assets/flags/es.svg';

const { t } = useI18n();

const locales = [
  { code: 'tr', name: 'Türkçe', flag: trFlag },
  { code: 'en', name: 'English', flag: enFlag },
  { code: 'de', name: 'Deutsch', flag: deFlag },
  { code: 'es', name: 'Español', flag: esFlag }
];

const currentLocaleCode = computed(() => getCurrentLocale());

const changeLanguage = (localeCode) => {
  setLocale(localeCode);
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
}

.flag-buttons {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.flag-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-input);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
  position: relative;
  overflow: hidden;
}

.flag-button:hover {
  background: var(--bg-hover);
  border-color: var(--border-focus);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.flag-button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--text-inverse);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.flag-button.active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--text-inverse);
  border-radius: 50%;
}

.flag {
  width: 24px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: transform var(--transition-fast);
}

.flag-button:hover .flag {
  transform: scale(1.1);
}

.flag-button.active .flag {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* Responsive */
@media (max-width: 768px) {
  .flag-button {
    width: 36px;
    height: 36px;
  }
  
  .flag {
    width: 20px;
    height: 14px;
  }
  
  .flag-buttons {
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .flag-button {
    width: 32px;
    height: 32px;
  }
  
  .flag {
    width: 18px;
    height: 12px;
  }
}
</style> 