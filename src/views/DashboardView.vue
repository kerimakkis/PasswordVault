<template>
    <div class="container mt-4">
      <h1 class="mb-4">Şifreleriniz</h1>
  
      <!-- Şifre Ekleme Formu -->
      <div class="mb-3">
        <input v-model="newWebsite" type="text" class="form-control mb-2" placeholder="Website (örn: github.com)" />
        <input v-model="newUsername" type="text" class="form-control mb-2" placeholder="Kullanıcı Adı" />
        <input v-model="newPassword" type="password" class="form-control mb-2" placeholder="Şifre" />
        <button @click="addPassword" class="btn btn-primary">Şifre Ekle</button>
      </div>
  
      <!-- Kayıtlı Şifreler Listesi -->
        <ul class="list-group">
        <li v-for="record in passwordList" :key="record.id" class="list-group-item d-flex justify-content-between align-items-center">
            <span>
            <strong>{{ record.website }}</strong> - {{ record.username }} - 
            <span v-if="record.decryptedPassword">{{ record.decryptedPassword }}</span>
            <button v-else @click="decryptStoredPassword(record)" class="btn btn-link btn-sm">Şifreyi Göster</button>
            </span>
            <button @click="deletePassword(record.id)" class="btn btn-danger btn-sm">Sil</button>
        </li>
        </ul>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../utils/db';
  import { useToast } from 'vue-toastification';
  import { encryptPassword, decryptPassword } from '../utils/encryption';

  const toast = useToast();
  const passwordList = ref([]);
  const newWebsite = ref('');
  const newUsername = ref('');
  const newPassword = ref('');
  const masterPassword = ref(localStorage.getItem('masterPassword') || '');
  
  // IndexedDB'den şifreleri çek
  const fetchPasswords = async () => {
    const storedPasswords = await db.passwords.toArray();
    passwordList.value = storedPasswords.map(record => ({
        ...record,
        decryptedPassword: null,  // Sifre varsayilanda gizli kalir
    }));
  };
  
  // Yeni şifre ekleme (AES-256 ile şifreleme)
  const addPassword = async () => {
    if (!newWebsite.value || !newUsername.value || !newPassword.value) {
      toast.error("Lütfen tüm alanları doldurun!", { timeout: 4000 }); // Hata mesajı, yeni sürüm uyumlu
      return;
    }

    if(!masterPassword.value){
        toast.error("Master Password bulunamadi!", { timeout: 4000 });
        return;
    }

    const encryptedPassword = encryptPassword(newPassword.value, masterPassword.value);

    await db.passwords.add({
      website: newWebsite.value,
      username: newUsername.value,
      encryptedPassword
    });

    newWebsite.value = '';
    newUsername.value = '';
    newPassword.value = '';
    fetchPasswords();
    toast.success("Şifre başariyla eklendi!", { timeout: 3000 });
  };
  
  // Şifre silme
  const deletePassword = async (id) => {
    await db.passwords.delete(id);
    fetchPasswords();
    toast.warning("Şifre silindi!", { timeout: 3000 });
  };
  
  // Şifre çözme (AES-256 ile çözme)
  const decryptStoredPassword = async (record) => {
    if(!masterPassword.value){
        toast.error("Master Password bulunamadi!", { timeout: 4000 });
        return;
    }

    const decryptedPassword = decryptPassword(record.encryptedPassword, masterPassword.value);
    if (decryptedPassword) {
        record.decryptedPassword = decrypted;
    } else {
        toast.error("Şifre çözülemedi!", { timeout: 4000 });
    }
  };

  // Sayfa açıldığında şifreleri getir
  onMounted(fetchPasswords);
  </script>
  