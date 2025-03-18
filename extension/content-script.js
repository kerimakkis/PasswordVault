// Şifre formlarını izleyen content script
console.log("Password Vault content script yüklendi:", window.location.href);

// Geçerli URL'nin bizim uygulamamızın bir parçası olup olmadığını kontrol et
function isOurAppPage() {
  const url = new URL(window.location.href);
  
  // Aynı origin'de (localhost:5173) ama uygulama sayfaları
  if (url.origin.includes('localhost:5173')) {
    // Sadece spesifik path'lerde çalışmasın
    const appPaths = ['/', '/login', '/dashboard', '/register'];
    return appPaths.some(path => {
      if (path === '/') {
        return url.pathname === '/' || url.pathname === '/index.html';
      }
      return url.pathname.startsWith(path);
    });
  }
  
  return false;
}

// Global değişken - form submit dinleyicisi zaten eklenmiş mi
let formSubmitListenerAdded = false;

// Bizim uygulamamız dışındaki tüm sayfalarda çalış
if (isOurAppPage()) {
  console.log("Kendi uygulamamızın ana sayfası - şifre yakalama devre dışı");
} else {
  console.log("Test sayfası veya dış site - şifre yakalama aktif:", window.location.href);
  
  // DOM yüklendiğinde işlemleri başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordVault);
  } else {
    initPasswordVault();
  }
}

// Ana başlatma fonksiyonu
function initPasswordVault() {
  createModal();
  addFormSubmitListeners();
}

// Modal HTML'ini oluştur
function createModal() {
  // Modal zaten varsa tekrar oluşturma
  if (document.getElementById('password-vault-modal')) {
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'password-vault-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    z-index: 99999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  `;

  modalContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="margin: 0; font-family: Arial, sans-serif;">Şifreyi Kaydet?</h3>
      <button id="password-vault-close" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
    </div>
    <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
      <p>Bu web sitesindeki şifreyi Password Vault'a kaydetmek istiyor musunuz?</p>
      <p><strong>Site:</strong> <span id="password-vault-website"></span></p>
      <p><strong>Kullanıcı Adı:</strong> <span id="password-vault-username"></span></p>
      <p><strong>Şifre:</strong> ••••••••</p>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 8px;">
      <button id="password-vault-cancel" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Hayır</button>
      <button id="password-vault-save" style="padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Evet, Kaydet</button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Modal butonları
  document.getElementById('password-vault-close').addEventListener('click', handleCancel);
  document.getElementById('password-vault-cancel').addEventListener('click', handleCancel);
  document.getElementById('password-vault-save').addEventListener('click', handleSave);
}

// Form Submit Event Listener'ları ekle
function addFormSubmitListeners() {
  if (formSubmitListenerAdded) return;
  
  // Sayfa üzerindeki tüm formlara event listener ekle
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    console.log("Form bulundu:", form);
    form.addEventListener('submit', handleFormSubmit, true);
  });
  
  // Yeni eklenen formları izle
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'FORM') {
          console.log("Yeni form eklendi:", node);
          node.addEventListener('submit', handleFormSubmit, true);
        }
        
        // İç içe form elementlerini kontrol et
        if (node.querySelectorAll) {
          const nestedForms = node.querySelectorAll('form');
          nestedForms.forEach(form => {
            console.log("İç içe form bulundu:", form);
            form.addEventListener('submit', handleFormSubmit, true);
          });
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  formSubmitListenerAdded = true;
  console.log("Form submit listener'ları eklendi");
}

// Form Submit Handler
function handleFormSubmit(event) {
  // event.preventDefault() burada çağırma, önce şifre kontrolü yap
  
  console.log("Form submit yakalandı:", event.target);
  
  const form = event.target;
  const passwordField = form.querySelector('input[type="password"]');
  
  if (!passwordField) {
    console.log("Şifre alanı bulunamadı, form submit'i devam ediyor");
    return true; // Şifre alanı yoksa normal submit işlemine devam et
  }
  
  console.log("Şifre alanı bulundu, işlem yapılıyor");
  const password = passwordField.value;
  
  if (!password || password.length === 0) {
    console.log("Şifre boş, form submit'i devam ediyor");
    return true; // Şifre boşsa normal submit işlemine devam et
  }
  
  // Kullanıcı adı/email alanını bul
  const usernameField = findUsernameField(form, passwordField);
  const username = usernameField ? usernameField.value : '';
  
  console.log("Kullanıcı adı ve şifre bulundu, form submit engelleniyor");
  
  // Form gönderimini engelle
  event.preventDefault();
  event.stopPropagation();
  
  // Form verilerini global değişkende sakla
  window.passwordVaultData = {
    username: username,
    password: password,
    website: window.location.hostname,
    form: form
  };
  
  // Modalı göster
  showModal(username, password, window.location.hostname);
  
  return false;
}

// Olası kullanıcı adı alanını bul
function findUsernameField(form, passwordField) {
  const usernameSelectors = [
    'input[type="email"]',
    'input[name*="email"]',
    'input[id*="email"]',
    'input[name*="user"]',
    'input[id*="user"]',
    'input[name*="login"]',
    'input[id*="login"]',
    'input[type="text"]'
  ];
  
  for (const selector of usernameSelectors) {
    const field = form.querySelector(selector);
    if (field && field.value) {
      return field;
    }
  }
  
  return null;
}

// Modal'ı göster
function showModal(username, password, website) {
  const modal = document.getElementById('password-vault-modal');
  if (!modal) return;
  
  document.getElementById('password-vault-username').textContent = username || 'Bilinmiyor';
  document.getElementById('password-vault-website').textContent = website;
  
  modal.style.display = 'flex';
}

// Kaydet'e tıklandığında
function handleSave() {
  if (!window.passwordVaultData) return;
  
  const { username, password, website } = window.passwordVaultData;
  
  console.log("Şifre kaydediliyor:", username, "******", website);
  
  // Background'a mesaj gönder
  chrome.runtime.sendMessage({
    action: "savePassword",
    data: { username, password, website }
  }, response => {
    console.log("Background yanıtı:", response);
    
    // Modalı kapat
    hideModal();
    
    // Form gönderimini tamamla
    submitOriginalForm();
  });
}

// İptal'e tıklandığında
function handleCancel() {
  console.log("Şifre kaydetme iptal edildi");
  
  // Modalı kapat
  hideModal();
  
  // Form gönderimini tamamla
  submitOriginalForm();
}

// Modalı gizle
function hideModal() {
  const modal = document.getElementById('password-vault-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Orijinal formu gönder
function submitOriginalForm() {
  if (!window.passwordVaultData) return;
  
  const form = window.passwordVaultData.form;
  
  // Global değişkeni temizle
  window.passwordVaultData = null;
  
  // Form gönderimini devam ettir
  if (form) {
    console.log("Orijinal form gönderiliyor");
    
    // Form öğelerini manuel olarak kopyalayarak yeni bir gönderim yap
    const formData = new FormData(form);
    const formMethod = form.method.toLowerCase() === 'post' ? 'post' : 'get';
    const formAction = form.action || window.location.href;
    
    // Yeni bir form oluştur ve gönder
    const tempForm = document.createElement('form');
    tempForm.method = formMethod;
    tempForm.action = formAction;
    tempForm.style.display = 'none';
    
    for (const [name, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      tempForm.appendChild(input);
    }
    
    document.body.appendChild(tempForm);
    tempForm.submit();
  }
} 