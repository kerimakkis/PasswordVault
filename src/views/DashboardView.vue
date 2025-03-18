<template>
    <div class="container mt-4">
      <h1 class="mb-4">Şifreleriniz</h1>
  
      <!-- 📌 Manuel Şifre Ekleme Formu -->
      <div class="mb-3">
        <input v-model="newWebsite" type="text" class="form-control mb-2" placeholder="Website (örn: github.com)" />
        <input v-model="newUsername" type="text" class="form-control mb-2" placeholder="Kullanıcı Adı" />
        <input v-model="newPassword" type="password" class="form-control mb-2" placeholder="Şifre" />
        <button @click="addPassword" class="btn btn-primary">Şifre Ekle</button>
      </div>
  
      <!-- 📌 Kayıtlı Şifreler Listesi -->
      <ul class="list-group">
        <li v-for="record in passwordList" :key="record.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            <strong>{{ record.website }}</strong> - {{ record.username }} - 
            <span v-if="record.decryptedPassword">{{ record.decryptedPassword }}</span>
            <button v-if="!record.decryptedPassword" @click="decryptStoredPassword(record)" class="btn btn-link btn-sm">Şifreyi Göster</button>
            <button v-else @click="hidePassword(record)" class="btn btn-link btn-sm text-danger">Şifreyi Gizle</button>
          </span>
          <div>
            <button @click="editPassword(record)" class="btn btn-warning btn-sm me-2">Değiştir</button>
            <button @click="deletePassword(record.id)" class="btn btn-danger btn-sm">Sil</button>
          </div>
        </li>
      </ul>
  
      <!-- 📌 AutoCapture Şifre Onay Modali -->
      <div v-if="showSavePrompt" class="modal d-block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Şifreyi Kaydet?</h5>
              <button @click="cancelSavePassword" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <p>Bu web sitesindeki şifreyi Password Vault'a kaydetmek istiyor musunuz?</p>
              <p><strong>Site:</strong> {{ capturedWebsite }}</p>
              <p><strong>Kullanıcı Adı:</strong> {{ capturedUsername }}</p>
              <p><strong>Şifre:</strong> ******</p>
            </div>
            <div class="modal-footer">
              <button @click="cancelSavePassword" class="btn btn-secondary">Hayır</button>
              <button @click="saveCapturedPassword" class="btn btn-success">Evet, Kaydet</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 📌 Şifre Güncelleme Modalı -->
      <div v-if="editModalOpen" class="modal d-block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Şifreyi Güncelle</h5>
              <button @click="editModalOpen = false" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <input v-model="editRecord.website" type="text" class="form-control mb-2" placeholder="Website" />
              <input v-model="editRecord.username" type="text" class="form-control mb-2" placeholder="Kullanıcı Adı" />
              <input v-model="editRecord.newPassword" type="password" class="form-control mb-2" placeholder="Yeni Şifre" />
            </div>
            <div class="modal-footer">
              <button @click="updatePassword" class="btn btn-success">Güncelle</button>
              <button @click="editModalOpen = false" class="btn btn-secondary">İptal</button>
            </div>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { db } from '../utils/db';
  import { useToast } from 'vue-toastification';
  import { encryptPassword, decryptPassword } from '../utils/encryption';
  import { observeLoginForms } from '../utils/autocapture';
  
  const toast = useToast();
  const passwordList = ref([]);
  const newWebsite = ref('');
  const newUsername = ref('');
  const newPassword = ref('');
  const masterPassword = ref(localStorage.getItem('masterPassword') || '');
  
  // **AutoCapture için değişkenler**
  const showSavePrompt = ref(false);
  const capturedWebsite = ref('');
  const capturedUsername = ref('');
  const capturedPassword = ref('');

  const editModalOpen = ref(false);
  const editRecord = ref({});
  
  // **IndexedDB'den Şifreleri Çek**
  const fetchPasswords = async () => {
    passwordList.value = await db.passwords.toArray();
  };
  
  // **AutoCapture ile Şifre Yakalama**
  const handleCapturedPassword = (username, password, website) => {
    capturedWebsite.value = website;
    capturedUsername.value = username;
    capturedPassword.value = password;
    showSavePrompt.value = true;
  };
  
  // **Kullanıcı Onay Verirse Şifreyi Kaydet**
  const saveCapturedPassword = async () => {
    if (!masterPassword.value) {
      toast.error("Master Password bulunamadı!");
      return;
    }
  
    const encryptedPassword = encryptPassword(capturedPassword.value, masterPassword.value);
  
    await db.passwords.add({
      website: capturedWebsite.value,
      username: capturedUsername.value,
      encryptedPassword
    });
  
    toast.success(`Şifre kaydedildi: ${capturedWebsite.value}`);
    showSavePrompt.value = false;
    fetchPasswords();
  };
  
  // **Kullanıcı İptal Ederse Modal Kapat**
  const cancelSavePassword = () => {
    showSavePrompt.value = false;
    toast.info("Şifre kaydetme işlemi iptal edildi");
  };
  
  // **Manuel Şifre Ekleme**
  const addPassword = async () => {
    if (!newWebsite.value || !newUsername.value || !newPassword.value) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }
  
    if (!masterPassword.value) {
      toast.error("Master Password bulunamadı!");
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
    toast.success("Şifre başarıyla eklendi!");
  };
  
  // **Şifre Yakalamayı Başlat**
  onMounted(() => {
    fetchPasswords();
    
    // Chrome storage'dan yakalanan şifreleri kontrol et
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['capturedData', 'showSavePrompt'], (result) => {
        if (result.showSavePrompt && result.capturedData) {
          capturedWebsite.value = result.capturedData.website;
          capturedUsername.value = result.capturedData.username;
          capturedPassword.value = result.capturedData.password;
          showSavePrompt.value = true;
          
          // Kullanıldıktan sonra temizle
          chrome.storage.local.set({ showSavePrompt: false });
        }
      });
    }
  });
  
  // Şifre gösterme/gizleme fonksiyonları
  const decryptStoredPassword = (record) => {
    if (!masterPassword.value) {
      toast.error("Master Password bulunamadı!");
      return;
    }
    
    const decrypted = decryptPassword(record.encryptedPassword, masterPassword.value);
    if (decrypted) {
      record.decryptedPassword = decrypted;
    } else {
      toast.error("Şifre çözülemedi!");
    }
  };
  
  const hidePassword = (record) => {
    record.decryptedPassword = null;
  };
  
  // Şifre düzenleme fonksiyonları
  const editPassword = (record) => {
    editRecord.value = { ...record, newPassword: '' };
    editModalOpen.value = true;
  };
  
  const updatePassword = async () => {
    if (!editRecord.value.website || !editRecord.value.username) {
      toast.error("Website ve kullanıcı adı gereklidir!");
      return;
    }
    
    const updatedRecord = {
      id: editRecord.value.id,
      website: editRecord.value.website,
      username: editRecord.value.username,
      encryptedPassword: editRecord.value.encryptedPassword
    };
    
    if (editRecord.value.newPassword) {
      updatedRecord.encryptedPassword = encryptPassword(
        editRecord.value.newPassword, 
        masterPassword.value
      );
    }
    
    await db.passwords.update(editRecord.value.id, updatedRecord);
    editModalOpen.value = false;
    fetchPasswords();
    toast.success("Şifre güncellendi!");
  };
  
  const deletePassword = async (id) => {
    if (confirm("Bu şifreyi silmek istediğinizden emin misiniz?")) {
      await db.passwords.delete(id);
      fetchPasswords();
      toast.success("Şifre silindi!");
    }
  };
  </script>
  
  <style scoped>
  .modal {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
  }
  </style>
  