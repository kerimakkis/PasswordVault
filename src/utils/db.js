import Dexie from 'dexie';

/**
 * Dexie database instance for PasswordVault.
 * @type {Dexie}
 */
export const db = new Dexie('passwordVault');

// DB şemasını ver
db.version(2).stores({
  users: '++id, username, passwordHash, salt, created',
  passwords: '++id, userId, website, username, encryptedPassword, dateAdded, categoryId',
  categories: '++id, userId, name, color, icon, created'
});

// Kullanıcı oturum kontrolü için basit yardımcı fonksiyonlar
/**
 * Authentication helper functions for managing user session.
 * @namespace auth
 */
export const auth = {
  // Aktif kullanıcı bilgilerini saklayacağımız yer (localStorage kullanabiliriz)
  currentUser: null,
  
  // LocalStorage'dan kullanıcı bilgilerini yükle
  /**
   * Loads user data from localStorage.
   * @returns {Object|null} The current user object or null if not found.
   */
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
  /**
   * Saves user data to localStorage and updates the current user state.
   * @param {Object} user - The user object to save.
   */
  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  // Çıkış yap
  /**
   * Logs out the current user by removing data from localStorage.
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  },
  
  // Kullanıcı giriş yapmış mı kontrol et
  /**
   * Checks if a user is currently logged in.
   * @returns {boolean} True if a user is logged in, false otherwise.
   */
  isLoggedIn() {
    return this.currentUser !== null;
  },
  
  // Kullanıcı ID'sini al
  /**
   * Gets the ID of the currently logged-in user.
   * @returns {number|undefined} The user ID or undefined if not logged in.
   */
  getUserId() {
    return this.currentUser?.id;
  }
};

// Uygulama başladığında kullanıcı bilgilerini yükle
auth.loadUser();
