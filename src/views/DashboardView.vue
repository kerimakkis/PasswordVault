<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <h1 class="header-title">
            <i class="fas fa-shield-alt"></i>
            Cüzdan Yönetimi
          </h1>
          <div class="header-actions">
            <span class="user-info">
              <i class="fas fa-user"></i>
              {{ currentUser?.username }}
            </span>
            <button 
              @click="logout" 
              class="btn btn-danger btn-sm"
            >
              <i class="fas fa-sign-out-alt"></i>
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Password Generator Section -->
        <div class="generator-section">
          <PasswordGenerator @password-generated="handlePasswordGenerated" />
          
          <!-- Import/Export Section -->
          <div class="import-export-section">
            <ImportExport />
          </div>
        </div>

        <!-- Password Management Section -->
        <div class="management-section">
          <!-- Category Filter -->
          <div class="category-filter-card">
            <div class="filter-header">
              <h3 class="filter-title">
                <i class="fas fa-filter"></i>
                Kategori Filtresi
              </h3>
              <button @click="showCategoryManager = true" class="btn btn-secondary btn-sm">
                <i class="fas fa-cog"></i>
                Kategorileri Yönet
              </button>
            </div>
            
            <div class="filter-options">
              <select v-model="selectedCategory" @change="fetchPasswords" class="form-control">
                <option value="all">Tüm Şifreler</option>
                <option value="uncategorized">Kategorisiz</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Add Password Form -->
          <div class="add-password-card">
            <h2 class="card-title">
              <i class="fas fa-plus"></i>
              Yeni Şifre Ekle
            </h2>
            <div class="form-grid">
              <input 
                v-model="newWebsite" 
                type="text" 
                class="form-control" 
                placeholder="Website (örn: github.com)" 
              />
              <input 
                v-model="newUsername" 
                type="text" 
                class="form-control" 
                placeholder="Kullanıcı Adı" 
              />
              <input 
                v-model="newPassword" 
                type="text" 
                class="form-control" 
                :class="{ 'generated-password': isGeneratedPassword }"
                placeholder="Şifre" 
                @focus="handlePasswordFocus"
              />
              <select v-model="newCategoryId" class="form-control">
                <option value="">Kategori Seçin (Opsiyonel)</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <button 
              @click="addPassword" 
              class="btn btn-primary"
            >
              <i class="fas fa-plus"></i>
              Şifre Ekle
            </button>
          </div>

          <!-- Password List -->
          <div class="password-list-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-list"></i>
                Kayıtlı Şifreler ({{ passwordList.length }})
              </h2>
            </div>
            
            <div v-if="passwordList.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Henüz kayıtlı şifre bulunmuyor.</p>
            </div>
            
            <div v-else class="password-list">
              <div 
                v-for="record in passwordList" 
                :key="record.id" 
                class="password-item"
              >
                <div class="password-content">
                  <div class="password-info">
                    <h3 class="website-name">
                      {{ record.website }}
                    </h3>
                    <span class="username">
                      {{ record.username }}
                    </span>
                    <div v-if="record.categoryId" class="password-category">
                      <span 
                        class="category-badge"
                        :style="{ 
                          backgroundColor: getCategoryById(record.categoryId)?.color + '20',
                          color: getCategoryById(record.categoryId)?.color,
                          borderColor: getCategoryById(record.categoryId)?.color
                        }"
                      >
                        <i :class="getCategoryById(record.categoryId)?.icon"></i>
                        {{ getCategoryById(record.categoryId)?.name }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="password-display">
                    <span v-if="record.decryptedPassword" class="password-text">
                      {{ record.decryptedPassword }}
                    </span>
                    <button 
                      v-if="!record.decryptedPassword" 
                      @click="decryptStoredPassword(record)" 
                      class="btn btn-sm btn-secondary"
                    >
                      <i class="fas fa-eye"></i>
                      Şifreyi Göster
                    </button>
                    <button 
                      v-else 
                      @click="hidePassword(record)" 
                      class="btn btn-sm btn-danger"
                    >
                      <i class="fas fa-eye-slash"></i>
                      Şifreyi Gizle
                    </button>
                  </div>
                  
                  <div class="password-meta">
                    <span class="date">
                      <i class="fas fa-calendar"></i>
                      {{ new Date(record.dateAdded).toLocaleDateString('tr-TR') }}
                    </span>
                  </div>
                </div>
                
                <div class="password-actions">
                  <button 
                    @click="editPassword(record)" 
                    class="btn btn-sm btn-warning"
                  >
                    <i class="fas fa-edit"></i>
                    Düzenle
                  </button>
                  <button 
                    @click="deletePassword(record.id)" 
                    class="btn btn-sm btn-danger"
                  >
                    <i class="fas fa-trash"></i>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AutoCapture Password Modal -->
    <div v-if="showCaptureModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Şifreyi Kaydet?</h3>
        </div>
        <div class="modal-body">
          <p>Bu web sitesindeki şifreyi Password Vault'a kaydetmek istiyor musunuz?</p>
          <div class="modal-info">
            <p><strong>Site:</strong> {{ capturedWebsite }}</p>
            <p><strong>Kullanıcı Adı:</strong> {{ capturedUsername }}</p>
            <p><strong>Şifre:</strong> ******</p>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            @click="cancelSavePassword" 
            class="btn btn-secondary"
          >
            Hayır
          </button>
          <button 
            @click="saveCapturedPassword" 
            class="btn btn-success"
          >
            Evet, Kaydet
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Password Modal -->
    <div v-if="editModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Şifreyi Güncelle</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Website</label>
            <input 
              v-model="editRecord.website" 
              type="text" 
              class="form-control" 
              placeholder="Website" 
            />
          </div>
          <div class="form-group">
            <label class="form-label">Kullanıcı Adı</label>
            <input 
              v-model="editRecord.username" 
              type="text" 
              class="form-control" 
              placeholder="Kullanıcı Adı" 
            />
          </div>
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select v-model="editRecord.categoryId" class="form-control">
              <option value="">Kategori Seçin</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Yeni Şifre</label>
            <input 
              v-model="editRecord.newPassword" 
              type="password" 
              class="form-control" 
              placeholder="Yeni Şifre (boş bırakılırsa değişmez)" 
            />
          </div>
        </div>
        <div class="modal-footer">
          <button 
            @click="closeModal" 
            class="btn btn-secondary"
          >
            İptal
          </button>
          <button 
            @click="updatePassword" 
            class="btn btn-success"
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>

    <!-- Category Manager Modal -->
    <div v-if="showCategoryManager" class="modal-overlay" @click="showCategoryManager = false">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <h3>Kategori Yönetimi</h3>
        </div>
        <div class="modal-body">
          <CategoryManager />
        </div>
        <div class="modal-footer">
          <button @click="showCategoryManager = false" class="btn btn-primary">
            Kapat
          </button>
        </div>
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
  
  await loadCategories();
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

// Yeni şifre oluşturulduğunda
const handlePasswordGenerated = (password) => {
  newPassword.value = password;
  isGeneratedPassword.value = true;
};

// Şifre alanına focus olduğunda
const handlePasswordFocus = () => {
  if (isGeneratedPassword.value) {
    newPassword.value = '';
    isGeneratedPassword.value = false;
  }
};

// Modal'ı kapat
const closeModal = () => {
  editModalOpen.value = false;
  editRecord.value = {};
};
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.dashboard-header {
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-primary);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg) 0;
  margin-bottom: var(--spacing-xl);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.header-title i {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.user-info i {
  color: var(--color-primary);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.generator-section {
  min-width: 0;
}

.import-export-section {
  margin-top: var(--spacing-xl);
}

.management-section {
  min-width: 0;
}

.category-filter-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.filter-title i {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.add-password-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-title i {
  color: var(--color-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.password-list-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.password-list-card .card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-primary);
  background-color: var(--bg-secondary);
}

.empty-state {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-muted);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.password-list {
  max-height: 600px;
  overflow-y: auto;
}

.password-item {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-primary);
  transition: background-color var(--transition-fast);
}

.password-item:hover {
  background-color: var(--bg-secondary);
}

.password-item:last-child {
  border-bottom: none;
}

.password-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.password-info {
  flex: 1;
  min-width: 0;
}

.website-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.username {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.password-category {
  margin-top: var(--spacing-xs);
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
}

.password-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.password-text {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
}

.password-meta {
  margin-top: var(--spacing-sm);
}

.date {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.password-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--spacing-lg);
  visibility: visible;
  opacity: 1;
}

.modal {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  visibility: visible;
  opacity: 1;
  transform: scale(1);
  transition: transform 0.2s ease-out;
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-primary);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-body {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.modal-info {
  margin-top: var(--spacing-md);
}

.modal-info p {
  margin-bottom: var(--spacing-sm);
}

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-primary);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .generator-section {
    order: 2;
  }
  
  .management-section {
    order: 1;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .password-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .password-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .modal {
    margin: var(--spacing-md);
  }
}

/* Generated Password Styling */
.generated-password {
  color: var(--text-muted) !important;
  font-style: italic;
  background-color: var(--bg-secondary) !important;
}
</style>
  