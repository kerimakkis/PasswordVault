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
  <main>
    <div class="container mt-5 text-center">
      <h1 class="display-4">Password Vault</h1>
      <p class="lead">Şifreleriniz güvende, tek tıkla erişilebilir.</p>
      
      <div class="my-5">
        <button @click="navigateBasedOnAuth" class="btn btn-primary btn-lg">
          Başlayın
        </button>
      </div>
      
      <div class="row mt-5">
        <div class="col-md-4">
          <h3>Güvenli</h3>
          <p>Tüm şifreleriniz AES ile şifrelenir ve sadece sizin erişiminize açıktır.</p>
        </div>
        <div class="col-md-4">
          <h3>Otomatik</h3>
          <p>Web sitelerindeki şifre formlarını otomatik olarak tespit eder ve kaydeder.</p>
        </div>
        <div class="col-md-4">
          <h3>Pratik</h3>
          <p>İstediğiniz zaman şifrelerinize kolayca erişebilir ve düzenleyebilirsiniz.</p>
        </div>
      </div>
    </div>
  </main>
</template> 