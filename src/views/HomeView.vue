<script setup>
import { useRouter } from 'vue-router';
import { auth } from '../utils/db';

const router = useRouter();

// Kullanıcı durumuna göre yönlendirme
const navigateBasedOnAuth = () => {
  if (auth.isLoggedIn()) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
};
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content text-center">
          <h1 class="hero-title">
            <i class="fas fa-shield-alt"></i>
            Password Vault
          </h1>
          <p class="hero-subtitle">
            Şifreleriniz güvende, tek tıkla erişilebilir.
          </p>
          
          <div class="hero-actions">
            <button @click="navigateBasedOnAuth" class="btn btn-primary btn-lg">
              <i class="fas fa-rocket"></i>
              Başlayın
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="row">
          <div class="col-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-lock"></i>
              </div>
              <h3>Güvenli</h3>
              <p>Tüm şifreleriniz AES ile şifrelenir ve sadece sizin erişiminize açıktır.</p>
            </div>
          </div>
          
          <div class="col-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-magic"></i>
              </div>
              <h3>Otomatik</h3>
              <p>Web sitelerindeki şifre formlarını otomatik olarak tespit eder ve kaydeder.</p>
            </div>
          </div>
          
          <div class="col-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-bolt"></i>
              </div>
              <h3>Pratik</h3>
              <p>İstediğiniz zaman şifrelerinize kolayca erişebilir ve düzenleyebilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero {
  padding: var(--spacing-2xl) 0;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  margin-bottom: var(--spacing-2xl);
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.hero-title i {
  color: var(--color-primary);
  margin-right: var(--spacing-md);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.hero-actions {
  margin-top: var(--spacing-xl);
}

.features {
  padding: var(--spacing-2xl) 0;
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--text-inverse);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .feature-card {
    margin-bottom: var(--spacing-lg);
  }
  
  .col-4 {
    margin-bottom: var(--spacing-lg);
  }
}
</style> 