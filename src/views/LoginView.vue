<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-card">
          <div class="card-header">
            <h2 class="text-center">
              <i class="fas fa-user-circle"></i>
              {{ isRegistering ? 'Hesap Oluştur' : 'Giriş Yap' }}
            </h2>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="submitForm" class="login-form">
              <div class="form-group">
                <label for="username" class="form-label">
                  <i class="fas fa-user"></i>
                  Kullanıcı Adı
                </label>
                <input 
                  v-model="username" 
                  type="text" 
                  class="form-control" 
                  id="username" 
                  placeholder="Kullanıcı adınızı girin"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="masterPassword" class="form-label">
                  <i class="fas fa-lock"></i>
                  Master Şifre
                </label>
                <input 
                  v-model="masterPassword" 
                  type="password" 
                  class="form-control" 
                  id="masterPassword" 
                  placeholder="Master şifrenizi girin"
                  required
                >
                <div class="form-text" v-if="isRegistering">
                  <i class="fas fa-info-circle"></i>
                  Bu şifre tüm kaydedilen şifrelerinizi koruyacak, güçlü bir şifre seçin!
                </div>
              </div>
              
              <div class="form-group" v-if="isRegistering">
                <label for="confirmPassword" class="form-label">
                  <i class="fas fa-check-circle"></i>
                  Şifreyi Doğrula
                </label>
                <input 
                  v-model="confirmPassword" 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  placeholder="Master şifrenizi tekrar girin"
                  required
                >
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary w-100" :disabled="!isValid">
                  <i :class="isRegistering ? 'fas fa-user-plus' : 'fas fa-sign-in-alt'"></i>
                  {{ isRegistering ? 'Kayıt Ol' : 'Giriş Yap' }}
                </button>
              </div>
              
              <div class="form-footer" v-if="hasAccount">
                <p v-if="isRegistering" class="text-center">
                  Zaten hesabınız var mı? 
                  <a href="#" @click.prevent="isRegistering = false">
                    <i class="fas fa-sign-in-alt"></i>
                    Giriş yapın
                  </a>
                </p>
                <p v-else class="text-center">
                  Hesabınız yok mu? 
                  <a href="#" @click.prevent="isRegistering = true">
                    <i class="fas fa-user-plus"></i>
                    Kayıt olun
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { db, auth } from '../utils/db';
import { hashPassword, generateSalt } from '../utils/encryption';

const router = useRouter();
const toast = useToast();

// Form verileri
const username = ref('');
const masterPassword = ref('');
const confirmPassword = ref('');
const isRegistering = ref(false);

// Kullanıcı hesabı var mı kontrolü
const hasAccount = ref(false);

// Form validasyonu
const isValid = computed(() => {
  if (!username.value || !masterPassword.value) return false;
  if (isRegistering.value && masterPassword.value !== confirmPassword.value) return false;
  return true;
});

// Kayıt ol
const register = async () => {
  if (!isValid.value) {
    toast.error('Lütfen tüm alanları doldurun ve şifrelerin eşleştiğinden emin olun');
    return;
  }
  
  try {
    // Salt oluştur ve şifreyi hash'le
    const salt = generateSalt();
    const passwordHash = hashPassword(masterPassword.value, salt);
    
    // Kullanıcıyı DB'ye kaydet
    const userId = await db.users.add({
      username: username.value,
      passwordHash,
      salt,
      created: new Date().toISOString()
    });
    
    // Kullanıcı bilgilerini kaydet
    const user = {
      id: userId,
      username: username.value,
      masterPassword: masterPassword.value // Şifre çözme için gerekli
    };
    
    // Oturumu başlat
    auth.saveUser(user);
    
    toast.success('Hesabınız oluşturuldu, giriş yapıldı!');
    router.push('/dashboard');
  } catch (error) {
    console.error('Kayıt hatası:', error);
    toast.error('Kayıt sırasında bir hata oluştu: ' + error.message);
  }
};

// Giriş yap
const login = async () => {
  if (!username.value || !masterPassword.value) {
    toast.error('Kullanıcı adı ve şifre gerekli!');
    return;
  }
  
  try {
    // Kullanıcıyı bul
    const user = await db.users.where('username').equals(username.value).first();
    
    if (!user) {
      toast.error('Kullanıcı bulunamadı');
      return;
    }
    
    // Şifreyi doğrula
    const passwordHash = hashPassword(masterPassword.value, user.salt);
    
    if (passwordHash !== user.passwordHash) {
      toast.error('Hatalı şifre');
      return;
    }
    
    // Kullanıcı bilgilerini kaydet
    auth.saveUser({
      id: user.id,
      username: user.username,
      masterPassword: masterPassword.value // Şifre çözme için gerekli
    });
    
    toast.success('Giriş başarılı!');
    router.push('/dashboard');
  } catch (error) {
    console.error('Giriş hatası:', error);
    toast.error('Giriş sırasında bir hata oluştu: ' + error.message);
  }
};

// Formları gönder
const submitForm = () => {
  if (isRegistering.value) {
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

.login-form .form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.form-label i {
  color: var(--color-primary);
  width: 16px;
}

.form-control {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1rem;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background-color: var(--bg-input);
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.form-control::placeholder {
  color: var(--text-muted);
}

.form-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: var(--spacing-sm);
}

.form-text i {
  color: var(--color-info);
}

.form-actions {
  margin-top: var(--spacing-xl);
}

.form-actions .btn {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1.125rem;
  font-weight: 600;
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
}

.form-footer a {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.form-footer a:hover {
  color: var(--color-primary-hover);
}

.form-footer a i {
  margin-right: var(--spacing-xs);
}

/* Responsive */
@media (max-width: 480px) {
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
}
</style>