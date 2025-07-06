import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { db, auth } from '../utils/db';
import { encryptPassword, decryptPassword } from '../utils/encryption';

export function useImportExport() {
  const toast = useToast();
  const loading = ref(false);

  // CSV formatında dışa aktar
  const exportToCSV = async () => {
    loading.value = true;
    try {
      const userId = auth.getUserId();
      if (!userId) throw new Error('Kullanıcı giriş yapmamış');

      const passwords = await db.passwords.where('userId').equals(userId).toArray();
      const categories = await db.categories.where('userId').equals(userId).toArray();
      
      // Şifreleri çöz
      const decryptedPasswords = passwords.map(password => {
        try {
          const decryptedPassword = decryptPassword(password.encryptedPassword, auth.loadUser()?.masterPassword);
          return {
            ...password,
            decryptedPassword
          };
        } catch (error) {
          console.error('Şifre çözülemedi:', error);
          return {
            ...password,
            decryptedPassword: '*** ÇÖZÜLEMEDİ ***'
          };
        }
      });

      // CSV başlıkları
      const headers = ['Website', 'Kullanıcı Adı', 'Şifre', 'Kategori', 'Eklenme Tarihi'];
      
      // CSV satırları
      const rows = decryptedPasswords.map(password => {
        const category = categories.find(cat => cat.id === password.categoryId);
        return [
          password.website,
          password.username,
          password.decryptedPassword,
          category ? category.name : 'Kategorisiz',
          new Date(password.dateAdded).toLocaleDateString('tr-TR')
        ];
      });

      // CSV içeriği oluştur
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Dosyayı indir
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `password-vault-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${decryptedPasswords.length} şifre CSV formatında dışa aktarıldı!`);
    } catch (error) {
      console.error('CSV dışa aktarma hatası:', error);
      toast.error('Dışa aktarma sırasında hata: ' + error.message);
    } finally {
      loading.value = false;
    }
  };

  // JSON formatında dışa aktar
  const exportToJSON = async () => {
    loading.value = true;
    try {
      const userId = auth.getUserId();
      if (!userId) throw new Error('Kullanıcı giriş yapmamış');

      const passwords = await db.passwords.where('userId').equals(userId).toArray();
      const categories = await db.categories.where('userId').equals(userId).toArray();
      
      // Şifreleri çöz
      const decryptedPasswords = passwords.map(password => {
        try {
          const decryptedPassword = decryptPassword(password.encryptedPassword, auth.loadUser()?.masterPassword);
          return {
            website: password.website,
            username: password.username,
            password: decryptedPassword,
            category: categories.find(cat => cat.id === password.categoryId)?.name || 'Kategorisiz',
            dateAdded: password.dateAdded
          };
        } catch (error) {
          console.error('Şifre çözülemedi:', error);
          return {
            website: password.website,
            username: password.username,
            password: '*** ÇÖZÜLEMEDİ ***',
            category: categories.find(cat => cat.id === password.categoryId)?.name || 'Kategorisiz',
            dateAdded: password.dateAdded
          };
        }
      });

      const exportData = {
        exportDate: new Date().toISOString(),
        totalPasswords: decryptedPasswords.length,
        passwords: decryptedPasswords
      };

      // Dosyayı indir
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `password-vault-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${decryptedPasswords.length} şifre JSON formatında dışa aktarıldı!`);
    } catch (error) {
      console.error('JSON dışa aktarma hatası:', error);
      toast.error('Dışa aktarma sırasında hata: ' + error.message);
    } finally {
      loading.value = false;
    }
  };

  // CSV dosyasından içe aktar
  const importFromCSV = async (file) => {
    loading.value = true;
    try {
      const userId = auth.getUserId();
      if (!userId) throw new Error('Kullanıcı giriş yapmamış');

      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
      // Gerekli sütunları kontrol et
      const requiredColumns = ['Website', 'Kullanıcı Adı', 'Şifre'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`Eksik sütunlar: ${missingColumns.join(', ')}`);
      }

      let importedCount = 0;
      let skippedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
        const website = values[headers.indexOf('Website')];
        const username = values[headers.indexOf('Kullanıcı Adı')];
        const password = values[headers.indexOf('Şifre')];
        const categoryName = values[headers.indexOf('Kategori')] || '';

        if (!website || !username || !password) {
          skippedCount++;
          continue;
        }

        // Kategoriyi bul veya oluştur
        let categoryId = null;
        if (categoryName && categoryName !== 'Kategorisiz') {
          let category = await db.categories.where('userId').equals(userId).filter(cat => cat.name === categoryName).first();
          if (!category) {
            categoryId = await db.categories.add({
              userId,
              name: categoryName,
              color: '#6b7280',
              icon: 'fas fa-tag',
              created: new Date().toISOString()
            });
          } else {
            categoryId = category.id;
          }
        }

        // Şifreyi şifrele ve kaydet
        const encryptedPassword = encryptPassword(password, auth.loadUser()?.masterPassword);
        await db.passwords.add({
          userId,
          website,
          username,
          encryptedPassword,
          categoryId,
          dateAdded: new Date().toISOString()
        });

        importedCount++;
      }

      toast.success(`${importedCount} şifre içe aktarıldı! ${skippedCount > 0 ? `(${skippedCount} satır atlandı)` : ''}`);
      return { importedCount, skippedCount };
    } catch (error) {
      console.error('CSV içe aktarma hatası:', error);
      toast.error('İçe aktarma sırasında hata: ' + error.message);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // JSON dosyasından içe aktar
  const importFromJSON = async (file) => {
    loading.value = true;
    try {
      const userId = auth.getUserId();
      if (!userId) throw new Error('Kullanıcı giriş yapmamış');

      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.passwords || !Array.isArray(data.passwords)) {
        throw new Error('Geçersiz JSON formatı');
      }

      let importedCount = 0;
      let skippedCount = 0;

      for (const passwordData of data.passwords) {
        const { website, username, password, category } = passwordData;

        if (!website || !username || !password) {
          skippedCount++;
          continue;
        }

        // Kategoriyi bul veya oluştur
        let categoryId = null;
        if (category && category !== 'Kategorisiz') {
          let categoryObj = await db.categories.where('userId').equals(userId).filter(cat => cat.name === category).first();
          if (!categoryObj) {
            categoryId = await db.categories.add({
              userId,
              name: category,
              color: '#6b7280',
              icon: 'fas fa-tag',
              created: new Date().toISOString()
            });
          } else {
            categoryId = categoryObj.id;
          }
        }

        // Şifreyi şifrele ve kaydet
        const encryptedPassword = encryptPassword(password, auth.loadUser()?.masterPassword);
        await db.passwords.add({
          userId,
          website,
          username,
          encryptedPassword,
          categoryId,
          dateAdded: passwordData.dateAdded || new Date().toISOString()
        });

        importedCount++;
      }

      toast.success(`${importedCount} şifre içe aktarıldı! ${skippedCount > 0 ? `(${skippedCount} kayıt atlandı)` : ''}`);
      return { importedCount, skippedCount };
    } catch (error) {
      console.error('JSON içe aktarma hatası:', error);
      toast.error('İçe aktarma sırasında hata: ' + error.message);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    exportToCSV,
    exportToJSON,
    importFromCSV,
    importFromJSON
  };
} 