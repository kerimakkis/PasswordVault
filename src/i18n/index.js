import { createI18n } from 'vue-i18n';

// Türkçe çeviriler
const tr = {
  // Genel
  common: {
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
    add: 'Ekle',
    update: 'Güncelle',
    close: 'Kapat',
    yes: 'Evet',
    no: 'Hayır',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    warning: 'Uyarı',
    info: 'Bilgi'
  },

  // Navigasyon
  nav: {
    home: 'Ana Sayfa',
    passwords: 'Şifreler',
    dashboard: 'Dashboard',
    settings: 'Ayarlar'
  },

  // Giriş/Kayıt
  auth: {
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    logout: 'Çıkış Yap',
    username: 'Kullanıcı Adı',
    masterPassword: 'Master Şifre',
    confirmPassword: 'Şifreyi Doğrula',
    loginSuccess: 'Giriş başarılı!',
    registerSuccess: 'Hesabınız oluşturuldu!',
    loginError: 'Giriş sırasında hata',
    registerError: 'Kayıt sırasında hata',
    invalidCredentials: 'Geçersiz kullanıcı adı veya şifre',
    userNotFound: 'Kullanıcı bulunamadı',
    passwordMismatch: 'Şifreler eşleşmiyor',
    alreadyHaveAccount: 'Zaten hesabınız var mı?',
    dontHaveAccount: 'Hesabınız yok mu?',
    masterPasswordInfo: 'Bu şifre tüm kaydedilen şifrelerinizi koruyacak, güçlü bir şifre seçin!'
  },

  // Dashboard
  dashboard: {
    title: 'Cüzdan Yönetimi',
    addPassword: 'Yeni Şifre Ekle',
    website: 'Website',
    password: 'Şifre',
    savedPasswords: 'Kayıtlı Şifreler',
    noPasswords: 'Henüz kayıtlı şifre bulunmuyor.',
    showPassword: 'Şifreyi Göster',
    hidePassword: 'Şifreyi Gizle',
    passwordAdded: 'Şifre eklendi!',
    passwordUpdated: 'Şifre güncellendi!',
    passwordDeleted: 'Şifre silindi!',
    passwordDecryptError: 'Şifre çözülemedi. Master şifre doğru mu?',
    websitePlaceholder: 'Website (örn: github.com)',
    usernamePlaceholder: 'Kullanıcı Adı',
    passwordPlaceholder: 'Şifre',
    newPasswordPlaceholder: 'Yeni Şifre (boş bırakılırsa değişmez)',
    updatePassword: 'Şifreyi Güncelle',
    editPassword: 'Şifreyi Düzenle'
  },

  // Kategoriler
  categories: {
    title: 'Kategori Yönetimi',
    addCategory: 'Yeni Kategori',
    editCategory: 'Kategori Düzenle',
    categoryName: 'Kategori Adı',
    categoryNamePlaceholder: 'Kategori adını girin',
    color: 'Renk',
    icon: 'İkon',
    categoryAdded: 'Kategori eklendi!',
    categoryUpdated: 'Kategori güncellendi!',
    categoryDeleted: 'Kategori silindi!',
    categoryDeleteError: 'Bu kategoriye ait şifreler var. Önce şifreleri başka kategoriye taşıyın.',
    filterTitle: 'Kategori Filtresi',
    manageCategories: 'Kategorileri Yönet',
    allPasswords: 'Tüm Şifreler',
    uncategorized: 'Kategorisiz',
    selectCategory: 'Kategori Seçin (Opsiyonel)',
    selectCategoryEdit: 'Kategori Seçin',
    defaultCategories: {
      work: 'İş',
      personal: 'Kişisel',
      banking: 'Banka',
      social: 'Sosyal Medya',
      email: 'E-posta',
      shopping: 'Alışveriş',
      gaming: 'Oyun',
      other: 'Diğer'
    }
  },

  // İçe/Dışa Aktar
  importExport: {
    title: 'İçe/Dışa Aktar',
    export: 'Dışa Aktar',
    import: 'İçe Aktar',
    exportDescription: 'Şifrelerinizi güvenli bir şekilde dışa aktarın',
    importDescription: 'CSV veya JSON dosyasından şifre içe aktarın',
    exportCSV: 'CSV Olarak İndir',
    exportJSON: 'JSON Olarak İndir',
    fileUploadPlaceholder: 'Dosya seçin veya sürükleyip bırakın',
    supportedFormats: 'CSV, JSON dosyaları desteklenir',
    importFile: 'İçe Aktar',
    processing: 'İşlem yapılıyor...',
    exportSuccess: 'şifre dışa aktarıldı!',
    importSuccess: 'şifre içe aktarıldı!',
    importError: 'İçe aktarma sırasında hata',
    exportError: 'Dışa aktarma sırasında hata',
    invalidFileType: 'Sadece CSV ve JSON dosyaları desteklenir!',
    invalidFormat: 'Desteklenmeyen dosya formatı!',
    missingColumns: 'Eksik sütunlar:',
    invalidJSON: 'Geçersiz JSON formatı',
    selectFile: 'Lütfen bir dosya seçin!'
  },

  // Şifre Üretici
  passwordGenerator: {
    title: 'Şifre Üretici',
    generatePassword: 'Şifre Oluştur',
    passwordLength: 'Şifre Uzunluğu',
    includeUppercase: 'Büyük Harfler (A-Z)',
    includeLowercase: 'Küçük Harfler (a-z)',
    includeNumbers: 'Sayılar (0-9)',
    includeSymbols: 'Özel Karakterler (!@#$%^&*)',
    excludeSimilar: 'Benzer Karakterleri Hariç Tut (l, 1, I, O, 0)',
    excludeAmbiguous: 'Belirsiz Karakterleri Hariç Tut ({}, [], (), /, \\, \', ", ~, ;, :)',
    generatedPassword: 'Oluşturulan Şifre',
    copyPassword: 'Şifreyi Kopyala',
    passwordCopied: 'Şifre kopyalandı!',
    passwordGenerated: 'Şifre oluşturuldu!'
  },

  // Test Kullanıcısı
  testUser: {
    title: 'Test Kullanıcısı',
    description: 'Demo için hızlı giriş yapın:',
    username: 'Kullanıcı:',
    password: 'Şifre:',
    quickLogin: 'Test Kullanıcısı ile Giriş',
    or: 'veya'
  },

  // Kayıtlı Kullanıcılar
  registeredUsers: {
    title: 'Kayıtlı Kullanıcılar',
    orNewUser: 'veya yeni kullanıcı'
  },

  // Modal'lar
  modals: {
    savePassword: 'Şifreyi Kaydet?',
    savePasswordDescription: 'Bu web sitesindeki şifreyi Password Vault\'a kaydetmek istiyor musunuz?',
    site: 'Site:',
    capturedPasswordSaved: 'Yakalanan şifre kaydedildi!',
    capturedPasswordError: 'Şifre kaydedilemedi:',
    autoSaveSuccess: 'için şifre otomatik olarak kaydedildi!',
    autoSaveError: 'Şifre otomatik kaydedilemedi:'
  }
};

// Almanca çeviriler
const de = {
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    update: 'Aktualisieren',
    close: 'Schließen',
    yes: 'Ja',
    no: 'Nein',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolgreich',
    warning: 'Warnung',
    info: 'Info'
  },

  nav: {
    home: 'Startseite',
    passwords: 'Passwörter',
    dashboard: 'Dashboard',
    settings: 'Einstellungen'
  },

  auth: {
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    username: 'Benutzername',
    masterPassword: 'Master-Passwort',
    confirmPassword: 'Passwort bestätigen',
    loginSuccess: 'Anmeldung erfolgreich!',
    registerSuccess: 'Konto erstellt!',
    loginError: 'Fehler bei der Anmeldung',
    registerError: 'Fehler bei der Registrierung',
    invalidCredentials: 'Ungültige Anmeldedaten',
    userNotFound: 'Benutzer nicht gefunden',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    dontHaveAccount: 'Haben Sie kein Konto?',
    masterPasswordInfo: 'Dieses Passwort schützt alle gespeicherten Passwörter, wählen Sie ein sicheres Passwort!'
  },

  dashboard: {
    title: 'Passwort-Verwaltung',
    addPassword: 'Neues Passwort hinzufügen',
    website: 'Website',
    password: 'Passwort',
    savedPasswords: 'Gespeicherte Passwörter',
    noPasswords: 'Noch keine Passwörter gespeichert.',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort ausblenden',
    passwordAdded: 'Passwort hinzugefügt!',
    passwordUpdated: 'Passwort aktualisiert!',
    passwordDeleted: 'Passwort gelöscht!',
    passwordDecryptError: 'Passwort konnte nicht entschlüsselt werden. Ist das Master-Passwort korrekt?',
    websitePlaceholder: 'Website (z.B. github.com)',
    usernamePlaceholder: 'Benutzername',
    passwordPlaceholder: 'Passwort',
    newPasswordPlaceholder: 'Neues Passwort (leer lassen für keine Änderung)',
    updatePassword: 'Passwort aktualisieren',
    editPassword: 'Passwort bearbeiten'
  },

  categories: {
    title: 'Kategorie-Verwaltung',
    addCategory: 'Neue Kategorie',
    editCategory: 'Kategorie bearbeiten',
    categoryName: 'Kategoriename',
    categoryNamePlaceholder: 'Kategoriename eingeben',
    color: 'Farbe',
    icon: 'Symbol',
    categoryAdded: 'Kategorie hinzugefügt!',
    categoryUpdated: 'Kategorie aktualisiert!',
    categoryDeleted: 'Kategorie gelöscht!',
    categoryDeleteError: 'Diese Kategorie enthält Passwörter. Verschieben Sie zuerst die Passwörter in eine andere Kategorie.',
    filterTitle: 'Kategorie-Filter',
    manageCategories: 'Kategorien verwalten',
    allPasswords: 'Alle Passwörter',
    uncategorized: 'Unkategorisiert',
    selectCategory: 'Kategorie auswählen (optional)',
    selectCategoryEdit: 'Kategorie auswählen',
    defaultCategories: {
      work: 'Arbeit',
      personal: 'Persönlich',
      banking: 'Banking',
      social: 'Soziale Medien',
      email: 'E-Mail',
      shopping: 'Einkaufen',
      gaming: 'Gaming',
      other: 'Sonstiges'
    }
  },

  importExport: {
    title: 'Import/Export',
    export: 'Exportieren',
    import: 'Importieren',
    exportDescription: 'Exportieren Sie Ihre Passwörter sicher',
    importDescription: 'Importieren Sie Passwörter aus CSV- oder JSON-Dateien',
    exportCSV: 'Als CSV herunterladen',
    exportJSON: 'Als JSON herunterladen',
    fileUploadPlaceholder: 'Datei auswählen oder hierher ziehen',
    supportedFormats: 'CSV, JSON-Dateien werden unterstützt',
    importFile: 'Importieren',
    processing: 'Verarbeitung...',
    exportSuccess: 'Passwörter exportiert!',
    importSuccess: 'Passwörter importiert!',
    importError: 'Fehler beim Importieren',
    exportError: 'Fehler beim Exportieren',
    invalidFileType: 'Nur CSV- und JSON-Dateien werden unterstützt!',
    invalidFormat: 'Nicht unterstütztes Dateiformat!',
    missingColumns: 'Fehlende Spalten:',
    invalidJSON: 'Ungültiges JSON-Format',
    selectFile: 'Bitte wählen Sie eine Datei aus!'
  },

  passwordGenerator: {
    title: 'Passwort-Generator',
    generatePassword: 'Passwort generieren',
    passwordLength: 'Passwort-Länge',
    includeUppercase: 'Großbuchstaben (A-Z)',
    includeLowercase: 'Kleinbuchstaben (a-z)',
    includeNumbers: 'Zahlen (0-9)',
    includeSymbols: 'Sonderzeichen (!@#$%^&*)',
    excludeSimilar: 'Ähnliche Zeichen ausschließen (l, 1, I, O, 0)',
    excludeAmbiguous: 'Mehrdeutige Zeichen ausschließen ({}, [], (), /, \\, \', ", ~, ;, :)',
    generatedPassword: 'Generiertes Passwort',
    copyPassword: 'Passwort kopieren',
    passwordCopied: 'Passwort kopiert!',
    passwordGenerated: 'Passwort generiert!'
  },

  testUser: {
    title: 'Test-Benutzer',
    description: 'Schnelle Anmeldung für Demo:',
    username: 'Benutzer:',
    password: 'Passwort:',
    quickLogin: 'Mit Test-Benutzer anmelden',
    or: 'oder'
  },

  registeredUsers: {
    title: 'Registrierte Benutzer',
    orNewUser: 'oder neuer Benutzer'
  },

  modals: {
    savePassword: 'Passwort speichern?',
    savePasswordDescription: 'Möchten Sie das Passwort dieser Website in Password Vault speichern?',
    site: 'Website:',
    capturedPasswordSaved: 'Erfasstes Passwort gespeichert!',
    capturedPasswordError: 'Passwort konnte nicht gespeichert werden:',
    autoSaveSuccess: 'Passwort automatisch gespeichert!',
    autoSaveError: 'Passwort konnte nicht automatisch gespeichert werden:'
  }
};

// İngilizce çeviriler
const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    update: 'Update',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info'
  },

  nav: {
    home: 'Home',
    passwords: 'Passwords',
    dashboard: 'Dashboard',
    settings: 'Settings'
  },

  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    username: 'Username',
    masterPassword: 'Master Password',
    confirmPassword: 'Confirm Password',
    loginSuccess: 'Login successful!',
    registerSuccess: 'Account created!',
    loginError: 'Login error',
    registerError: 'Registration error',
    invalidCredentials: 'Invalid username or password',
    userNotFound: 'User not found',
    passwordMismatch: 'Passwords do not match',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    masterPasswordInfo: 'This password will protect all your saved passwords, choose a strong password!'
  },

  dashboard: {
    title: 'Password Management',
    addPassword: 'Add New Password',
    website: 'Website',
    password: 'Password',
    savedPasswords: 'Saved Passwords',
    noPasswords: 'No passwords saved yet.',
    showPassword: 'Show Password',
    hidePassword: 'Hide Password',
    passwordAdded: 'Password added!',
    passwordUpdated: 'Password updated!',
    passwordDeleted: 'Password deleted!',
    passwordDecryptError: 'Password could not be decrypted. Is the master password correct?',
    websitePlaceholder: 'Website (e.g. github.com)',
    usernamePlaceholder: 'Username',
    passwordPlaceholder: 'Password',
    newPasswordPlaceholder: 'New Password (leave empty for no change)',
    updatePassword: 'Update Password',
    editPassword: 'Edit Password'
  },

  categories: {
    title: 'Category Management',
    addCategory: 'New Category',
    editCategory: 'Edit Category',
    categoryName: 'Category Name',
    categoryNamePlaceholder: 'Enter category name',
    color: 'Color',
    icon: 'Icon',
    categoryAdded: 'Category added!',
    categoryUpdated: 'Category updated!',
    categoryDeleted: 'Category deleted!',
    categoryDeleteError: 'This category contains passwords. Move passwords to another category first.',
    filterTitle: 'Category Filter',
    manageCategories: 'Manage Categories',
    allPasswords: 'All Passwords',
    uncategorized: 'Uncategorized',
    selectCategory: 'Select Category (Optional)',
    selectCategoryEdit: 'Select Category',
    defaultCategories: {
      work: 'Work',
      personal: 'Personal',
      banking: 'Banking',
      social: 'Social Media',
      email: 'Email',
      shopping: 'Shopping',
      gaming: 'Gaming',
      other: 'Other'
    }
  },

  importExport: {
    title: 'Import/Export',
    export: 'Export',
    import: 'Import',
    exportDescription: 'Export your passwords securely',
    importDescription: 'Import passwords from CSV or JSON files',
    exportCSV: 'Download as CSV',
    exportJSON: 'Download as JSON',
    fileUploadPlaceholder: 'Select file or drag and drop here',
    supportedFormats: 'CSV, JSON files are supported',
    importFile: 'Import',
    processing: 'Processing...',
    exportSuccess: 'passwords exported!',
    importSuccess: 'passwords imported!',
    importError: 'Import error',
    exportError: 'Export error',
    invalidFileType: 'Only CSV and JSON files are supported!',
    invalidFormat: 'Unsupported file format!',
    missingColumns: 'Missing columns:',
    invalidJSON: 'Invalid JSON format',
    selectFile: 'Please select a file!'
  },

  passwordGenerator: {
    title: 'Password Generator',
    generatePassword: 'Generate Password',
    passwordLength: 'Password Length',
    includeUppercase: 'Uppercase Letters (A-Z)',
    includeLowercase: 'Lowercase Letters (a-z)',
    includeNumbers: 'Numbers (0-9)',
    includeSymbols: 'Special Characters (!@#$%^&*)',
    excludeSimilar: 'Exclude Similar Characters (l, 1, I, O, 0)',
    excludeAmbiguous: 'Exclude Ambiguous Characters ({}, [], (), /, \\, \', ", ~, ;, :)',
    generatedPassword: 'Generated Password',
    copyPassword: 'Copy Password',
    passwordCopied: 'Password copied!',
    passwordGenerated: 'Password generated!'
  },

  testUser: {
    title: 'Test User',
    description: 'Quick login for demo:',
    username: 'Username:',
    password: 'Password:',
    quickLogin: 'Login with Test User',
    or: 'or'
  },

  registeredUsers: {
    title: 'Registered Users',
    orNewUser: 'or new user'
  },

  modals: {
    savePassword: 'Save Password?',
    savePasswordDescription: 'Do you want to save the password from this website to Password Vault?',
    site: 'Site:',
    capturedPasswordSaved: 'Captured password saved!',
    capturedPasswordError: 'Password could not be saved:',
    autoSaveSuccess: 'password automatically saved!',
    autoSaveError: 'Password could not be automatically saved:'
  }
};

// İspanyolca çeviriler
const es = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    update: 'Actualizar',
    close: 'Cerrar',
    yes: 'Sí',
    no: 'No',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información'
  },

  nav: {
    home: 'Inicio',
    passwords: 'Contraseñas',
    dashboard: 'Panel',
    settings: 'Configuración'
  },

  auth: {
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    username: 'Nombre de Usuario',
    masterPassword: 'Contraseña Maestra',
    confirmPassword: 'Confirmar Contraseña',
    loginSuccess: '¡Inicio de sesión exitoso!',
    registerSuccess: '¡Cuenta creada!',
    loginError: 'Error de inicio de sesión',
    registerError: 'Error de registro',
    invalidCredentials: 'Nombre de usuario o contraseña inválidos',
    userNotFound: 'Usuario no encontrado',
    passwordMismatch: 'Las contraseñas no coinciden',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    masterPasswordInfo: '¡Esta contraseña protegerá todas tus contraseñas guardadas, elige una contraseña fuerte!'
  },

  dashboard: {
    title: 'Gestión de Contraseñas',
    addPassword: 'Agregar Nueva Contraseña',
    website: 'Sitio Web',
    password: 'Contraseña',
    savedPasswords: 'Contraseñas Guardadas',
    noPasswords: 'Aún no hay contraseñas guardadas.',
    showPassword: 'Mostrar Contraseña',
    hidePassword: 'Ocultar Contraseña',
    passwordAdded: '¡Contraseña agregada!',
    passwordUpdated: '¡Contraseña actualizada!',
    passwordDeleted: '¡Contraseña eliminada!',
    passwordDecryptError: 'No se pudo descifrar la contraseña. ¿Es correcta la contraseña maestra?',
    websitePlaceholder: 'Sitio web (ej. github.com)',
    usernamePlaceholder: 'Nombre de Usuario',
    passwordPlaceholder: 'Contraseña',
    newPasswordPlaceholder: 'Nueva Contraseña (dejar vacío para no cambiar)',
    updatePassword: 'Actualizar Contraseña',
    editPassword: 'Editar Contraseña'
  },

  categories: {
    title: 'Gestión de Categorías',
    addCategory: 'Nueva Categoría',
    editCategory: 'Editar Categoría',
    categoryName: 'Nombre de Categoría',
    categoryNamePlaceholder: 'Ingrese nombre de categoría',
    color: 'Color',
    icon: 'Icono',
    categoryAdded: '¡Categoría agregada!',
    categoryUpdated: '¡Categoría actualizada!',
    categoryDeleted: '¡Categoría eliminada!',
    categoryDeleteError: 'Esta categoría contiene contraseñas. Mueve las contraseñas a otra categoría primero.',
    filterTitle: 'Filtro de Categorías',
    manageCategories: 'Gestionar Categorías',
    allPasswords: 'Todas las Contraseñas',
    uncategorized: 'Sin Categorizar',
    selectCategory: 'Seleccionar Categoría (Opcional)',
    selectCategoryEdit: 'Seleccionar Categoría',
    defaultCategories: {
      work: 'Trabajo',
      personal: 'Personal',
      banking: 'Bancario',
      social: 'Redes Sociales',
      email: 'Correo',
      shopping: 'Compras',
      gaming: 'Juegos',
      other: 'Otros'
    }
  },

  importExport: {
    title: 'Importar/Exportar',
    export: 'Exportar',
    import: 'Importar',
    exportDescription: 'Exporta tus contraseñas de forma segura',
    importDescription: 'Importa contraseñas desde archivos CSV o JSON',
    exportCSV: 'Descargar como CSV',
    exportJSON: 'Descargar como JSON',
    fileUploadPlaceholder: 'Selecciona archivo o arrastra aquí',
    supportedFormats: 'Se admiten archivos CSV, JSON',
    importFile: 'Importar',
    processing: 'Procesando...',
    exportSuccess: '¡contraseñas exportadas!',
    importSuccess: '¡contraseñas importadas!',
    importError: 'Error de importación',
    exportError: 'Error de exportación',
    invalidFileType: '¡Solo se admiten archivos CSV y JSON!',
    invalidFormat: '¡Formato de archivo no soportado!',
    missingColumns: 'Columnas faltantes:',
    invalidJSON: 'Formato JSON inválido',
    selectFile: '¡Por favor selecciona un archivo!'
  },

  passwordGenerator: {
    title: 'Generador de Contraseñas',
    generatePassword: 'Generar Contraseña',
    passwordLength: 'Longitud de Contraseña',
    includeUppercase: 'Letras Mayúsculas (A-Z)',
    includeLowercase: 'Letras Minúsculas (a-z)',
    includeNumbers: 'Números (0-9)',
    includeSymbols: 'Caracteres Especiales (!@#$%^&*)',
    excludeSimilar: 'Excluir Caracteres Similares (l, 1, I, O, 0)',
    excludeAmbiguous: 'Excluir Caracteres Ambiguos ({}, [], (), /, \\, \', ", ~, ;, :)',
    generatedPassword: 'Contraseña Generada',
    copyPassword: 'Copiar Contraseña',
    passwordCopied: '¡Contraseña copiada!',
    passwordGenerated: '¡Contraseña generada!'
  },

  testUser: {
    title: 'Usuario de Prueba',
    description: 'Inicio de sesión rápido para demo:',
    username: 'Usuario:',
    password: 'Contraseña:',
    quickLogin: 'Iniciar Sesión con Usuario de Prueba',
    or: 'o'
  },

  registeredUsers: {
    title: 'Usuarios Registrados',
    orNewUser: 'o nuevo usuario'
  },

  modals: {
    savePassword: '¿Guardar Contraseña?',
    savePasswordDescription: '¿Quieres guardar la contraseña de este sitio web en Password Vault?',
    site: 'Sitio:',
    capturedPasswordSaved: '¡Contraseña capturada guardada!',
    capturedPasswordError: 'No se pudo guardar la contraseña:',
    autoSaveSuccess: '¡contraseña guardada automáticamente!',
    autoSaveError: 'No se pudo guardar la contraseña automáticamente:'
  }
};

// Dil seçenekleri
export const availableLocales = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' }
];

// Varsayılan dil
const defaultLocale = 'tr';

// LocalStorage'dan dil tercihini al
const savedLocale = localStorage.getItem('locale') || defaultLocale;

// i18n instance oluştur
export const i18n = createI18n({
  legacy: false, // Vue 3 Composition API için
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    tr,
    de,
    en,
    es
  }
});

// Dil değiştirme fonksiyonu
export function setLocale(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
}

// Mevcut dili al
export function getCurrentLocale() {
  return i18n.global.locale.value;
} 