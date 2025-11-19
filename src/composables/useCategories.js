import { ref, computed } from 'vue';
import { db } from '../utils/db';
import { auth } from '../utils/db';

// Varsayılan kategoriler
const DEFAULT_CATEGORIES = [
  { name: 'İş', color: '#3b82f6', icon: 'fas fa-briefcase' },
  { name: 'Kişisel', color: '#10b981', icon: 'fas fa-user' },
  { name: 'Banka', color: '#f59e0b', icon: 'fas fa-university' },
  { name: 'Sosyal Medya', color: '#8b5cf6', icon: 'fas fa-share-alt' },
  { name: 'E-posta', color: '#ef4444', icon: 'fas fa-envelope' },
  { name: 'Alışveriş', color: '#06b6d4', icon: 'fas fa-shopping-cart' },
  { name: 'Oyun', color: '#84cc16', icon: 'fas fa-gamepad' },
  { name: 'Diğer', color: '#6b7280', icon: 'fas fa-ellipsis-h' }
];

/**
 * Composable for managing categories.
 * @returns {Object} Category state and management methods.
 */
export function useCategories() {
  const categories = ref([]);
  const loading = ref(false);

  // Kategorileri yükle
  /**
   * Loads categories for the current user.
   * Creates default categories if none exist.
   */
  const loadCategories = async () => {
    loading.value = true;
    try {
      const userId = auth.getUserId();
      if (!userId) return;

      let userCategories = await db.categories.where('userId').equals(userId).toArray();

      // Eğer kullanıcının hiç kategorisi yoksa varsayılanları oluştur
      if (userCategories.length === 0) {
        await createDefaultCategories(userId);
        userCategories = await db.categories.where('userId').equals(userId).toArray();
      }

      categories.value = userCategories;
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    } finally {
      loading.value = false;
    }
  };

  // Varsayılan kategorileri oluştur
  /**
   * Creates default categories for a new user.
   * @param {number} userId - The user ID.
   */
  const createDefaultCategories = async (userId) => {
    const promises = DEFAULT_CATEGORIES.map(category =>
      db.categories.add({
        userId,
        name: category.name,
        color: category.color,
        icon: category.icon,
        created: new Date().toISOString()
      })
    );
    await Promise.all(promises);
  };

  // Yeni kategori ekle
  /**
   * Adds a new category.
   * @param {Object} categoryData - The category data.
   * @returns {Promise<Object>} The created category.
   */
  const addCategory = async (categoryData) => {
    try {
      const userId = auth.getUserId();
      if (!userId) throw new Error('Kullanıcı giriş yapmamış');

      const newCategory = {
        userId,
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
        created: new Date().toISOString()
      };

      const id = await db.categories.add(newCategory);
      newCategory.id = id;
      categories.value.push(newCategory);

      return newCategory;
    } catch (error) {
      console.error('Kategori eklenirken hata:', error);
      throw error;
    }
  };

  // Kategori güncelle
  /**
   * Updates an existing category.
   * @param {number} id - The category ID.
   * @param {Object} categoryData - The new category data.
   */
  const updateCategory = async (id, categoryData) => {
    try {
      await db.categories.update(id, categoryData);

      const index = categories.value.findIndex(cat => cat.id === id);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...categoryData };
      }
    } catch (error) {
      console.error('Kategori güncellenirken hata:', error);
      throw error;
    }
  };

  // Kategori sil
  /**
   * Deletes a category.
   * Throws error if category contains passwords.
   * @param {number} id - The category ID.
   */
  const deleteCategory = async (id) => {
    try {
      // Önce bu kategoriye ait şifreleri kontrol et
      const passwordsInCategory = await db.passwords.where('categoryId').equals(id).count();

      if (passwordsInCategory > 0) {
        throw new Error('Bu kategoriye ait şifreler var. Önce şifreleri başka kategoriye taşıyın.');
      }

      await db.categories.delete(id);
      categories.value = categories.value.filter(cat => cat.id !== id);
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      throw error;
    }
  };

  // Kategoriye göre şifreleri getir
  /**
   * Gets passwords belonging to a specific category.
   * @param {number|string} categoryId - The category ID or filter ('all', 'uncategorized').
   * @returns {Promise<Array>} List of passwords.
   */
  const getPasswordsByCategory = async (categoryId) => {
    try {
      const userId = auth.getUserId();
      if (!userId) return [];

      if (categoryId === 'all') {
        return await db.passwords.where('userId').equals(userId).toArray();
      } else if (categoryId === 'uncategorized') {
        return await db.passwords.where('userId').equals(userId).filter(p => !p.categoryId).toArray();
      } else {
        return await db.passwords.where('userId').equals(userId).filter(p => p.categoryId === categoryId).toArray();
      }
    } catch (error) {
      console.error('Kategori şifreleri getirilirken hata:', error);
      return [];
    }
  };

  // Kategori adına göre kategori bul
  /**
   * Finds a category by its name.
   * @param {string} name - The category name.
   * @returns {Object|undefined} The category object.
   */
  const getCategoryByName = (name) => {
    return categories.value.find(cat => cat.name === name);
  };

  // Kategori ID'sine göre kategori bul
  /**
   * Finds a category by its ID.
   * @param {number} id - The category ID.
   * @returns {Object|undefined} The category object.
   */
  const getCategoryById = (id) => {
    return categories.value.find(cat => cat.id === id);
  };

  // Kategori istatistikleri
  /**
   * Computed property for category statistics.
   * @returns {Array} Categories with additional stats.
   */
  const getCategoryStats = computed(() => {
    return categories.value.map(category => ({
      ...category,
      passwordCount: 0 // Bu değer ayrıca hesaplanacak
    }));
  });

  return {
    categories,
    loading,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getPasswordsByCategory,
    getCategoryByName,
    getCategoryById,
    getCategoryStats
  };
} 