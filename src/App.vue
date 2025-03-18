<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="container mt-4">
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Password Vault</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Giriş</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link">Şifreler</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
