<template>
  <div class="import-export">
    <div class="ie-header">
      <h3 class="ie-title">
        <i class="fas fa-exchange-alt"></i>
        İçe/Dışa Aktar
      </h3>
    </div>

    <div class="ie-content">
      <!-- Dışa Aktarma Bölümü -->
      <div class="export-section">
        <h4 class="section-title">
          <i class="fas fa-download"></i>
          Dışa Aktar
        </h4>
        <p class="section-description">
          Şifrelerinizi güvenli bir şekilde dışa aktarın
        </p>
        
        <div class="export-buttons">
          <button 
            @click="exportToCSV" 
            :disabled="loading"
            class="btn btn-primary"
          >
            <i class="fas fa-file-csv"></i>
            CSV Olarak İndir
          </button>
          
          <button 
            @click="exportToJSON" 
            :disabled="loading"
            class="btn btn-secondary"
          >
            <i class="fas fa-file-code"></i>
            JSON Olarak İndir
          </button>
        </div>
      </div>

      <!-- İçe Aktarma Bölümü -->
      <div class="import-section">
        <h4 class="section-title">
          <i class="fas fa-upload"></i>
          İçe Aktar
        </h4>
        <p class="section-description">
          CSV veya JSON dosyasından şifre içe aktarın
        </p>
        
        <div class="import-options">
          <div class="file-upload-area">
            <input 
              ref="fileInput"
              type="file" 
              accept=".csv,.json"
              @change="handleFileUpload"
              class="file-input"
            />
            <div class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Dosya seçin veya sürükleyip bırakın</p>
              <span class="file-types">CSV, JSON dosyaları desteklenir</span>
            </div>
          </div>
          
          <div v-if="selectedFile" class="selected-file">
            <div class="file-info">
              <i class="fas fa-file"></i>
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
            </div>
            <button @click="importFile" :disabled="loading" class="btn btn-success">
              <i class="fas fa-upload"></i>
              İçe Aktar
            </button>
          </div>
        </div>
      </div>

      <!-- Yükleme Durumu -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>İşlem yapılıyor...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useImportExport } from '../composables/useImportExport';

const toast = useToast();
const { loading, exportToCSV, exportToJSON, importFromCSV, importFromJSON } = useImportExport();

const fileInput = ref(null);
const selectedFile = ref(null);

// Dosya yükleme
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Dosya tipini kontrol et
  const validTypes = ['text/csv', 'application/json'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  if (!validTypes.includes(file.type) && !['csv', 'json'].includes(fileExtension)) {
    toast.error('Sadece CSV ve JSON dosyaları desteklenir!');
    return;
  }

  selectedFile.value = file;
};

// Dosya içe aktar
const importFile = async () => {
  if (!selectedFile.value) {
    toast.error('Lütfen bir dosya seçin!');
    return;
  }

  try {
    const fileExtension = selectedFile.value.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      await importFromCSV(selectedFile.value);
    } else if (fileExtension === 'json') {
      await importFromJSON(selectedFile.value);
    } else {
      toast.error('Desteklenmeyen dosya formatı!');
      return;
    }

    // Dosya seçimini temizle
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }

    // Sayfayı yenile (şifre listesini güncellemek için)
    window.location.reload();
  } catch (error) {
    console.error('Dosya içe aktarma hatası:', error);
  }
};

// Dosya boyutunu formatla
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.import-export {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  position: relative;
}

.ie-header {
  margin-bottom: var(--spacing-xl);
}

.ie-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.ie-title i {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.ie-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.export-section,
.import-section {
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title i {
  color: var(--color-primary);
}

.section-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-lg);
}

.export-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.export-buttons .btn {
  justify-content: flex-start;
  padding: var(--spacing-md);
}

.file-upload-area {
  position: relative;
  border: 2px dashed var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.file-upload-area:hover {
  border-color: var(--color-primary);
  background: var(--bg-hover);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  pointer-events: none;
}

.upload-placeholder i {
  font-size: 2rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-md);
}

.upload-placeholder p {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.file-types {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.selected-file {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.file-info i {
  color: var(--color-primary);
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
}

.file-size {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  z-index: 10;
}

.dark .loading-overlay {
  background: rgba(0, 0, 0, 0.9);
}

.loading-spinner {
  text-align: center;
  color: var(--text-primary);
}

.loading-spinner i {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

/* Responsive */
@media (max-width: 768px) {
  .ie-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .export-buttons {
    flex-direction: column;
  }
  
  .selected-file {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
  
  .file-info {
    justify-content: center;
  }
}
</style> 