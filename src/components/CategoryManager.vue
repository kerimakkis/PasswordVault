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