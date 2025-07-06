<template>
  <div class="category-manager">
    <div class="category-header">
      <h3 class="category-title">
        <i class="fas fa-tags"></i>
        Kategori Yönetimi
      </h3>
      <button @click="showAddModal = true" class="btn btn-primary btn-sm">
        <i class="fas fa-plus"></i>
        Yeni Kategori
      </button>
    </div>

    <!-- Kategori Listesi -->
    <div class="categories-list">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="category-item"
        :style="{ borderLeftColor: category.color }"
      >
        <div class="category-info">
          <div class="category-icon" :style="{ color: category.color }">
            <i :class="category.icon"></i>
          </div>
          <div class="category-details">
            <h4 class="category-name">{{ category.name }}</h4>
            <span class="category-date">{{ new Date(category.created).toLocaleDateString('tr-TR') }}</span>
          </div>
        </div>
        
        <div class="category-actions">
          <button @click="editCategory(category)" class="btn btn-sm btn-warning">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="deleteCategory(category.id)" class="btn btn-sm btn-danger">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Yeni Kategori Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Yeni Kategori Ekle</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Kategori Adı</label>
            <input 
              v-model="newCategory.name" 
              type="text" 
              class="form-control" 
              placeholder="Kategori adını girin"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Renk</label>
            <div class="color-picker">
              <div 
                v-for="color in colorOptions" 
                :key="color"
                class="color-option"
                :class="{ active: newCategory.color === color }"
                :style="{ backgroundColor: color }"
                @click="newCategory.color = color"
              ></div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">İkon</label>
            <div class="icon-picker">
              <div 
                v-for="icon in iconOptions" 
                :key="icon"
                class="icon-option"
                :class="{ active: newCategory.icon === icon }"
                @click="newCategory.icon = icon"
              >
                <i :class="icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddModal = false" class="btn btn-secondary">
            İptal
          </button>
          <button @click="addCategory" class="btn btn-success">
            Ekle
          </button>
        </div>
      </div>
    </div>

    <!-- Düzenleme Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Kategori Düzenle</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Kategori Adı</label>
            <input 
              v-model="editingCategory.name" 
              type="text" 
              class="form-control" 
              placeholder="Kategori adını girin"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Renk</label>
            <div class="color-picker">
              <div 
                v-for="color in colorOptions" 
                :key="color"
                class="color-option"
                :class="{ active: editingCategory.color === color }"
                :style="{ backgroundColor: color }"
                @click="editingCategory.color = color"
              ></div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">İkon</label>
            <div class="icon-picker">
              <div 
                v-for="icon in iconOptions" 
                :key="icon"
                class="icon-option"
                :class="{ active: editingCategory.icon === icon }"
                @click="editingCategory.icon = icon"
              >
                <i :class="icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showEditModal = false" class="btn btn-secondary">
            İptal
          </button>
          <button @click="updateCategory" class="btn btn-success">
            Güncelle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useCategories } from '../composables/useCategories';

const toast = useToast();
const { 
  categories, 
  loading, 
  loadCategories, 
  addCategory: addCategoryToDb, 
  updateCategory: updateCategoryInDb, 
  deleteCategory: deleteCategoryFromDb 
} = useCategories();

// Modal states
const showAddModal = ref(false);
const showEditModal = ref(false);

// Form data
const newCategory = ref({
  name: '',
  color: '#3b82f6',
  icon: 'fas fa-tag'
});

const editingCategory = ref({});

// Color ve icon seçenekleri
const colorOptions = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#06b6d4', '#84cc16', '#6b7280',
  '#f97316', '#ec4899', '#14b8a6', '#6366f1'
];

const iconOptions = [
  'fas fa-tag', 'fas fa-briefcase', 'fas fa-user', 'fas fa-university',
  'fas fa-share-alt', 'fas fa-envelope', 'fas fa-shopping-cart', 'fas fa-gamepad',
  'fas fa-home', 'fas fa-work', 'fas fa-heart', 'fas fa-star',
  'fas fa-lock', 'fas fa-key', 'fas fa-shield-alt', 'fas fa-cog'
];

// Kategori ekle
const addCategory = async () => {
  if (!newCategory.value.name.trim()) {
    toast.error('Kategori adı gerekli!');
    return;
  }

  try {
    await addCategoryToDb(newCategory.value);
    showAddModal.value = false;
    newCategory.value = { name: '', color: '#3b82f6', icon: 'fas fa-tag' };
    toast.success('Kategori eklendi!');
  } catch (error) {
    toast.error('Kategori eklenirken hata: ' + error.message);
  }
};

// Kategori düzenle
const editCategory = (category) => {
  editingCategory.value = { ...category };
  showEditModal.value = true;
};

// Kategori güncelle
const updateCategory = async () => {
  if (!editingCategory.value.name.trim()) {
    toast.error('Kategori adı gerekli!');
    return;
  }

  try {
    await updateCategoryInDb(editingCategory.value.id, {
      name: editingCategory.value.name,
      color: editingCategory.value.color,
      icon: editingCategory.value.icon
    });
    showEditModal.value = false;
    editingCategory.value = {};
    toast.success('Kategori güncellendi!');
  } catch (error) {
    toast.error('Kategori güncellenirken hata: ' + error.message);
  }
};

// Kategori sil
const deleteCategory = async (id) => {
  try {
    await deleteCategoryFromDb(id);
    toast.success('Kategori silindi!');
  } catch (error) {
    toast.error('Kategori silinirken hata: ' + error.message);
  }
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.category-manager {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.category-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.category-title i {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-input);
  border: 1px solid var(--border-primary);
  border-left: 4px solid;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.category-item:hover {
  background: var(--bg-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.category-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.category-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.category-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.category-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.category-date {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.category-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Color Picker */
.color-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: var(--text-primary);
  transform: scale(1.1);
}

/* Icon Picker */
.icon-picker {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.icon-option {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-secondary);
}

.icon-option:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.icon-option.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--text-inverse);
}

/* Responsive */
@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
  
  .category-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .color-picker {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .icon-picker {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style> 