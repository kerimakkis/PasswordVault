import Dexie from 'dexie';

export const db = new Dexie('passwordVault');

// DB şemasını ver
db.version(1).stores({
  users: '++id, username, passwordHash, salt, created',
  passwords: '++id, userId, website, username, encryptedPassword, dateAdded'
});

// Kullanıcı oturum kontrolü için basit yardımcı fonksiyonlar
export const auth = {
  // Aktif kullanıcı bilgilerini saklayacağımız yer (localStorage kullanabiliriz)
  currentUser: null,
  
  // LocalStorage'dan kullanıcı bilgilerini yükle
  loadUser() {
    try {
      const userData = localStorage.getItem('currentUser');
      this.currentUser = userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('User data could not be loaded', e);
      this.currentUser = null;
    }
    return this.currentUser;
  },
  
  // Kullanıcı bilgilerini kaydet
  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  // Çıkış yap
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  },
  
  // Kullanıcı giriş yapmış mı kontrol et
  isLoggedIn() {
    return this.currentUser !== null;
  },
  
  // Kullanıcı ID'sini al
  getUserId() {
    return this.currentUser?.id;
  }
};

// Uygulama başladığında kullanıcı bilgilerini yükle
auth.loadUser();
