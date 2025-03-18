<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">{{ isRegistering ? 'Hesap Oluştur' : 'Giriş Yap' }}</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="username" class="form-label">Kullanıcı Adı</label>
                <input 
                  v-model="username" 
                  type="text" 
                  class="form-control" 
                  id="username" 
                  placeholder="Kullanıcı adınızı girin"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="masterPassword" class="form-label">Master Şifre</label>
                <input 
                  v-model="masterPassword" 
                  type="password" 
                  class="form-control" 
                  id="masterPassword" 
                  placeholder="Master şifrenizi girin"
                  required
                >
                <small class="text-muted" v-if="isRegistering">Bu şifre tüm kaydedilen şifrelerinizi koruyacak, güçlü bir şifre seçin!</small>
              </div>
              
              <div class="mb-3" v-if="isRegistering">
                <label for="confirmPassword" class="form-label">Şifreyi Doğrula</label>
                <input 
                  v-model="confirmPassword" 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  placeholder="Master şifrenizi tekrar girin"
                  required
                >
              </div>
              
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="!isValid">
                  {{ isRegistering ? 'Kayıt Ol' : 'Giriş Yap' }}
                </button>
              </div>
              
              <div class="mt-3 text-center" v-if="hasAccount">
                <p v-if="isRegistering">
                  Zaten hesabınız var mı? 
                  <a href="#" @click.prevent="isRegistering = false">Giriş yapın</a>
                </p>
                <p v-else>
                  Hesabınız yok mu? 
                  <a href="#" @click.prevent="isRegistering = true">Kayıt olun</a>
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