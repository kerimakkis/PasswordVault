<template>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Şifreleriniz</h1>
        <div>
          <span class="me-3">{{ currentUser?.username }}</span>
          <button @click="logout" class="btn btn-outline-danger">Çıkış Yap</button>
        </div>
      </div>
  
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
      <div v-if="showCaptureModal" class="modal d-block">
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
  import { ref, onMounted, computed } from 'vue';
  import { useToast } from 'vue-toastification';
  import { useRouter } from 'vue-router';
  import { db, auth } from '../utils/db';
  import { encryptPassword, decryptPassword } from '../utils/encryption';
  
  const router = useRouter();
  const toast = useToast();
  
  // Kullanıcı bilgileri
  const currentUser = ref(null);
  
  // Şifre listesi
  const passwordList = ref([]);
  
  // Yeni şifre ekleme için
  const newWebsite = ref('');
  const newUsername = ref('');
  const newPassword = ref('');
  
  // Şifre düzenleme için
  const editModalOpen = ref(false);
  const editRecord = ref({});
  
  // AutoCapture ile yakalanan şifreler için
  const showCaptureModal = ref(false);
  const capturedWebsite = ref('');
  const capturedUsername = ref('');
  const capturedPassword = ref('');
  
  // Master password'e kolay erişim
  const masterPassword = computed(() => currentUser.value?.masterPassword || '');
  
  // Şifreleri veritabanından çek
  const fetchPasswords = async () => {
    const userId = auth.getUserId();
    if (!userId) return;
    
    passwordList.value = await db.passwords.where('userId').equals(userId).toArray();
  };
  
  // Yeni şifre ekle
  const addPassword = async () => {
    if (!newWebsite.value || !newUsername.value || !newPassword.value) {
      toast.error("Tüm alanları doldurun!");
      return;
    }
    
    const encryptedPassword = encryptPassword(newPassword.value, masterPassword.value);
    const userId = auth.getUserId();
    
    await db.passwords.add({
      userId,
      website: newWebsite.value,
      username: newUsername.value,
      encryptedPassword,
      dateAdded: new Date().toISOString()
    });
    
    newWebsite.value = '';
    newUsername.value = '';
    newPassword.value = '';
    
    fetchPasswords();
    toast.success("Şifre eklendi!");
  };
  
  // Yakalanan şifreyi kaydet
  const saveCapturedPassword = async () => {
    if (!capturedWebsite.value || !capturedUsername.value || !capturedPassword.value) {
      toast.error("Şifre bilgileri eksik!");
      return;
    }
    
    const encryptedPassword = encryptPassword(capturedPassword.value, masterPassword.value);
    const userId = auth.getUserId();
    
    try {
      await db.passwords.add({
        userId,
        website: capturedWebsite.value,
        username: capturedUsername.value,
        encryptedPassword,
        dateAdded: new Date().toISOString()
      });
      
      showCaptureModal.value = false;
      capturedWebsite.value = '';
      capturedUsername.value = '';
      capturedPassword.value = '';
      
      fetchPasswords();
      toast.success("Yakalanan şifre kaydedildi!");
    } catch (error) {
      console.error("Şifre kaydedilemedi:", error);
      toast.error("Şifre kaydedilemedi: " + error.message);
    }
  };
  
  // URL'den gelen şifreyi otomatik kaydet
  const savePasswordFromUrl = async (website, username, password) => {
    if (!website || !username || !password) {
      console.error("Şifre bilgileri eksik!");
      return false;
    }
    
    const encryptedPassword = encryptPassword(password, masterPassword.value);
    const userId = auth.getUserId();
    
    try {
      await db.passwords.add({
        userId,
        website: website,
        username: username,
        encryptedPassword,
        dateAdded: new Date().toISOString()
      });
      
      fetchPasswords();
      toast.success(`${website} için şifre otomatik olarak kaydedildi!`);
      return true;
    } catch (error) {
      console.error("Şifre otomatik kaydedilemedi:", error);
      toast.error("Şifre otomatik kaydedilemedi: " + error.message);
      return false;
    }
  };
  
  // Şifre kaydetmeyi iptal et
  const cancelSavePassword = () => {
    showCaptureModal.value = false;
    capturedWebsite.value = '';
    capturedUsername.value = '';
    capturedPassword.value = '';
  };
  
  // Şifreyi göster/gizle
  const decryptStoredPassword = (record) => {
    try {
      record.decryptedPassword = decryptPassword(record.encryptedPassword, masterPassword.value);
    } catch (error) {
      console.error("Şifre çözülemedi:", error);
      toast.error("Şifre çözülemedi. Master şifre doğru mu?");
    }
  };
  
  // Şifreyi gizle
  const hidePassword = (record) => {
    record.decryptedPassword = null;
  };
  
  // Şifre düzenleme penceresini aç
  const editPassword = (record) => {
    editRecord.value = { ...record, newPassword: '' };
    editModalOpen.value = true;
  };
  
  // Şifreyi güncelle
  const updatePassword = async () => {
    if (!editRecord.value.website || !editRecord.value.username) {
      toast.error("Website ve kullanıcı adı gerekli!");
      return;
    }
    
    const updatedRecord = { ...editRecord.value };
    
    // Şifre değiştiyse güncelle
    if (updatedRecord.newPassword) {
      updatedRecord.encryptedPassword = encryptPassword(updatedRecord.newPassword, masterPassword.value);
    }
    
    delete updatedRecord.newPassword;
    delete updatedRecord.decryptedPassword;
    
    try {
      await db.passwords.update(updatedRecord.id, updatedRecord);
      editModalOpen.value = false;
      fetchPasswords();
      toast.success("Şifre güncellendi!");
    } catch (error) {
      console.error("Şifre güncellenemedi:", error);
      toast.error("Şifre güncellenemedi: " + error.message);
    }
  };
  
  // Şifre sil
  const deletePassword = async (id) => {
    try {
      await db.passwords.delete(id);
      fetchPasswords();
      toast.success("Şifre silindi!");
    } catch (error) {
      console.error("Şifre silinemedi:", error);
      toast.error("Şifre silinemedi: " + error.message);
    }
  };
  
  // Çıkış yap
  const logout = () => {
    auth.logout();
    router.push('/login');
    toast.info("Çıkış yapıldı");
  };
  
  // Sayfa yüklendiğinde
  onMounted(async () => {
    // Kullanıcı bilgilerini al
    currentUser.value = auth.loadUser();
    
    if (!currentUser.value) {
      router.push('/login');
      return;
    }
    
    await fetchPasswords();
    
    // URL parametrelerini kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('captured') === 'true') {
      const website = urlParams.get('website') || '';
      const username = urlParams.get('username') || '';
      const password = urlParams.get('password') || '';
      
      console.log("URL'den şifre bilgileri alındı:", {
        username: username,
        website: website,
        password: password ? "******" : "boş"
      });
      
      // Şifreyi otomatik olarak kaydet
      if (website && username && password) {
        const saved = await savePasswordFromUrl(website, username, password);
        
        if (!saved) {
          // Otomatik kayıt başarısız olursa, manuel onay modalını göster
          capturedWebsite.value = website;
          capturedUsername.value = username;
          capturedPassword.value = password;
          showCaptureModal.value = true;
        }
      }
      
      // Parametreleri temizle
      window.history.replaceState({}, document.title, "/dashboard");
    }
  });
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
    z-index: 1050;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
  }
  </style>
  