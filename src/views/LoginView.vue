<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-card">
          <div class="card-header">
            <h2 class="text-center">
              <i class="fas fa-user-circle"></i>
              {{ isRegistering ? t('auth.register') : t('auth.login') }}
            </h2>
          </div>
          
          <div class="card-body">
            <!-- Test Kullanıcısı Hızlı Giriş -->
            <div v-if="!isRegistering" class="test-user-section">
              <div class="test-user-card">
                <h4><i class="fas fa-flask"></i> {{ t('testUser.title') }}</h4>
                <p>{{ t('testUser.description') }}</p>
                <div class="test-user-info">
                  <span><strong>{{ t('testUser.username') }}</strong> kerim</span>
                  <span><strong>{{ t('testUser.password') }}</strong> 12345</span>
                </div>
                <button @click="quickLogin" class="btn btn-secondary w-100">
                  <i class="fas fa-rocket"></i> {{ t('testUser.quickLogin') }}
                </button>
              </div>
              <div class="divider">
                <span>{{ t('testUser.or') }}</span>
              </div>
            </div>

            <!-- Kayıtlı Kullanıcılar Listesi -->
            <div v-if="!isRegistering && registeredUsers.length > 0" class="registered-users-section">
              <h4><i class="fas fa-users"></i> {{ t('registeredUsers.title') }}</h4>
              <div class="users-list">
                <div 
                  v-for="user in registeredUsers" 
                  :key="user.id"
                  class="user-item"
                  @click="selectUser(user)"
                >
                  <i class="fas fa-user"></i>
                  <span>{{ user.username }}</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
              <div class="divider">
                <span>{{ t('registeredUsers.orNewUser') }}</span>
              </div>
            </div>

            <form @submit.prevent="submitForm" class="login-form">
              <div class="form-group">
                <label for="username" class="form-label">
                  <i class="fas fa-user"></i>
                  {{ t('auth.username') }}
                </label>
                <input 
                  v-model="username" 
                  type="text" 
                  class="form-control" 
                  id="username" 
                  :placeholder="t('auth.username')"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="masterPassword" class="form-label">
                  <i class="fas fa-lock"></i>
                  {{ t('auth.masterPassword') }}
                </label>
                <input 
                  v-model="masterPassword" 
                  type="password" 
                  class="form-control" 
                  id="masterPassword" 
                  :placeholder="t('auth.masterPassword')"
                  required
                >
                <div class="form-text" v-if="isRegistering">
                  <i class="fas fa-info-circle"></i>
                  {{ t('auth.masterPasswordInfo') }}
                </div>
              </div>
              
              <div class="form-group" v-if="isRegistering">
                <label for="confirmPassword" class="form-label">
                  <i class="fas fa-check-circle"></i>
                  {{ t('auth.confirmPassword') }}
                </label>
                <input 
                  v-model="confirmPassword" 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  :placeholder="t('auth.confirmPassword')"
                  required
                >
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary w-100" :disabled="!isValid">
                  <i :class="isRegistering ? 'fas fa-user-plus' : 'fas fa-sign-in-alt'"></i>
                  {{ isRegistering ? t('auth.register') : t('auth.login') }}
                </button>
              </div>
              
              <div class="form-footer" v-if="hasAccount">
                <p v-if="isRegistering" class="text-center">
                  {{ t('auth.alreadyHaveAccount') }} 
                  <a href="#" @click.prevent="isRegistering = false">
                    <i class="fas fa-sign-in-alt"></i>
                    {{ t('auth.login') }}
                  </a>
                </p>
                <p v-else class="text-center">
                  {{ t('auth.dontHaveAccount') }} 
                  <a href="#" @click.prevent="isRegistering = true">
                    <i class="fas fa-user-plus"></i>
                    {{ t('auth.register') }}
                  </a>
                </p>
              </div>
            </form>
          </div>
    register();
  } else {
    login();
  }
};

// Sayfa yüklendiğinde kullanıcı hesabı var mı kontrol et
onMounted(async () => {
  const userCount = await db.users.count();
  hasAccount.value = userCount > 0;
  isRegistering.value = userCount === 0; // İlk kullanımda otomatik kayıt formu göster
  
  // Zaten giriş yapılmış mı kontrol et
  if (auth.isLoggedIn()) {
    router.push('/dashboard');
  }

  await loadRegisteredUsers();
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  padding: var(--spacing-lg);
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.login-card .card-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: var(--text-inverse);
  text-align: center;
  padding: var(--spacing-xl);
}

.login-card .card-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.login-card .card-header i {
  margin-right: var(--spacing-sm);
  font-size: 2rem;
}

.login-card .card-body {
  padding: var(--spacing-xl);
}

/* ===== LOGIN FORM STYLES ===== */
.login-form .form-group {
  margin-bottom: var(--spacing-lg);
}

.login-form .form-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.login-form .form-label i {
  color: var(--color-primary);
  width: 16px;
  text-align: center;
}

.login-form .form-control {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1rem;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background-color: var(--bg-input);
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.login-form .form-control:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.login-form .form-control::placeholder {
  color: var(--text-muted);
}

.login-form .form-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: var(--spacing-sm);
}

.login-form .form-text i {
  color: var(--color-info);
}

/* ===== FORM ACTIONS & FOOTER ===== */
.form-actions {
  margin-top: var(--spacing-xl);
}

.form-actions .btn {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1.125rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.form-actions .btn:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.form-actions .btn i {
  margin-right: var(--spacing-sm);
}

.form-footer {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-primary);
}

.form-footer p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.form-footer a {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.form-footer a:hover {
  color: var(--color-primary-hover);
}

.form-footer a i {
  font-size: 0.875rem;
}

/* ===== LOGIN PAGE COMPONENTS ===== */

/* Test User Section */
.test-user-section {
  margin-bottom: var(--spacing-lg);
}

.test-user-card {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  text-align: center;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal);
}

.test-user-card:hover {
  box-shadow: var(--shadow-md);
}

.test-user-card h4 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1.125rem;
  font-weight: 600;
}

.test-user-card h4 i {
  color: var(--color-warning);
  margin-right: var(--spacing-sm);
}

.test-user-card p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
}

.test-user-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
  gap: var(--spacing-sm);
}

.test-user-info span {
  background: var(--bg-input);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
  flex: 1;
  text-align: center;
}

/* Registered Users Section */
.registered-users-section {
  margin-bottom: var(--spacing-lg);
}

.registered-users-section h4 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.125rem;
  font-weight: 600;
}

.registered-users-section h4 i {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.users-list {
  margin-bottom: var(--spacing-md);
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: var(--bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.user-item:hover {
  background: var(--bg-hover);
  border-color: var(--border-focus);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.user-item i:first-child {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
  width: 16px;
  text-align: center;
}

.user-item i:last-child {
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* Divider */
.divider {
  text-align: center;
  margin: var(--spacing-lg) 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-primary);
}

.divider span {
  background: var(--bg-card);
  padding: 0 var(--spacing-md);
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .login-page {
    padding: var(--spacing-md);
  }
  
  .login-card .card-header {
    padding: var(--spacing-lg);
  }
  
  .login-card .card-body {
    padding: var(--spacing-lg);
  }
  
  .login-card .card-header h2 {
    font-size: 1.5rem;
  }
  
  .test-user-info {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .user-item {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .test-user-card,
  .registered-users-section {
    margin-bottom: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: var(--spacing-sm);
  }
  
  .login-card .card-header {
    padding: var(--spacing-md);
  }
  
  .login-card .card-body {
    padding: var(--spacing-md);
  }
  
  .login-card .card-header h2 {
    font-size: 1.25rem;
  }
  
  .test-user-card h4,
  .registered-users-section h4 {
    font-size: 1rem;
  }
  
  .test-user-info span {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.8rem;
  }
}
</style>