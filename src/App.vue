<script setup>
import { RouterView } from 'vue-router';
import { useTheme } from './composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <div id="app">
    <!-- Theme Toggle Button -->
    <button @click="toggleTheme" class="theme-toggle" :title="isDark ? 'Light Mode' : 'Dark Mode'">
      <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
    </button>

    <!-- Navigation -->
    <nav class="navbar">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="fas fa-shield-alt"></i>
          Password Vault
        </a>
        
        <ul class="navbar-nav">
          <li>
            <router-link to="/" class="nav-link">
              <i class="fas fa-home"></i>
              Ana Sayfa
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard" class="nav-link">
              <i class="fas fa-key"></i>
              Şifreler
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
main.container {
  margin-top: var(--spacing-2xl);
  flex: 1;
}

.navbar-brand i {
  margin-right: var(--spacing-sm);
  color: var(--color-primary);
}

.nav-link i {
  margin-right: var(--spacing-xs);
}

/* Mobile responsive navbar */
@media (max-width: 768px) {
  .navbar .container {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  .navbar-nav {
    width: 100%;
  }
  
  .nav-link {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-lg);
    transition: background-color var(--transition-fast);
  }
  
  .nav-link:hover {
    background-color: var(--bg-secondary);
  }
}
</style>
