<template>
    <div class="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 class="mb-3">Password Vault'e Hoşgeldiniz</h1>
      <input v-model="masterPassword" type="password" class="form-control w-50" placeholder="Master Password" />
      <button @click="login" class="btn btn-primary mt-3">Giriş Yap</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  const router = useRouter();
  const masterPassword = ref('');
  const toast = useToast();

  const login = () => {
    if (masterPassword.value) {
      localStorage.setItem('masterPassword', masterPassword.value);
      router.push('/dashboard');
    } else {
      toast.error("Lütfen Master Password girin!", { timeout: 4000 });
    }
  };
  </script>