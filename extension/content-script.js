// Şifre formlarını izleyen content script
console.log("Password Vault content script yüklendi");

// Modal HTML'ini oluştur ve body'ye ekle
function createModal() {
  const modalDiv = document.createElement('div');
  modalDiv.id = 'password-vault-modal';
  modalDiv.style.display = 'none';
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalDiv.style.zIndex = '9999';
  modalDiv.style.display = 'flex';
  modalDiv.style.alignItems = 'center';
  modalDiv.style.justifyContent = 'center';
  
  const modalContent = document.createElement('div');
  modalContent.style.background = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.width = '400px';
  modalContent.style.maxWidth = '90%';
  modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  
  modalContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; font-family: Arial, sans-serif;">Şifreyi Kaydet?</h3>
      <button id="password-vault-close" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
    </div>
    <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
      <p>Bu web sitesindeki şifreyi Password Vault'a kaydetmek istiyor musunuz?</p>
      <p><strong>Site:</strong> <span id="password-vault-website"></span></p>
      <p><strong>Kullanıcı Adı:</strong> <span id="password-vault-username"></span></p>
      <p><strong>Şifre:</strong> ******</p>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button id="password-vault-cancel" style="padding: 8px 12px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Hayır</button>
      <button id="password-vault-save" style="padding: 8px 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Evet, Kaydet</button>
    </div>
  `;
  
  modalDiv.appendChild(modalContent);
  document.body.appendChild(modalDiv);
  
  // Modal'ı gizle
  modalDiv.style.display = 'none';
  
  // Modal olay dinleyicileri
  document.getElementById('password-vault-close').addEventListener('click', hideModal);
  document.getElementById('password-vault-cancel').addEventListener('click', hideModal);
  document.getElementById('password-vault-save').addEventListener('click', savePasswordAndRedirect);
}

// Modal'ı göster
function showModal(username, password, website) {
  const modal = document.getElementById('password-vault-modal');
  
  // Modal yoksa oluştur
  if (!modal) {
    createModal();
  }
  
  // Modal'ı doldur
  document.getElementById('password-vault-username').textContent = username;
  document.getElementById('password-vault-website').textContent = website;
  
  // Modal'ı göster
  document.getElementById('password-vault-modal').style.display = 'flex';
  
  // Şifre bilgilerini geçici olarak sakla
  window.passwordVaultCapturedData = {
    username: username,
    password: password,
    website: website
  };
}

// Modal'ı gizle
function hideModal() {
  document.getElementById('password-vault-modal').style.display = 'none';
  
  // Geçici verileri temizle
  window.passwordVaultCapturedData = null;
}

// Şifreyi kaydet ve dashboard'a yönlendir
function savePasswordAndRedirect() {
  const capturedData = window.passwordVaultCapturedData;
  
  if (capturedData) {
    // Background script'e mesaj gönder
    chrome.runtime.sendMessage({
      action: "savePasswordAndRedirect",
      data: capturedData
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Mesaj gönderilemedi:", chrome.runtime.lastError);
      } else {
        console.log("Mesaj gönderildi, yanıt:", response);
      }
    });
    
    // Modal'ı gizle
    hideModal();
  }
}

// Dashboard sayfası kontrolü
if (window.location.href.includes("localhost:5173/dashboard")) {
  console.log("Dashboard sayfasında content script çalışmayacak");
} else {
  // Normal sayfalarda AutoCapture'ı başlat
  observeLoginForms();
  
  // Modal'ı oluştur
  createModal();
}

// Şifre formlarını izle
function observeLoginForms() {
  // Sayfa yüklendiğinde mevcut formları ve şifre alanlarını kontrol et
  setTimeout(() => {
    detectForms();
    detectPasswordFields();
  }, 1000); // Sayfa yüklendikten sonra çalıştır

  // Yeni eklenen inputları takip etmek için MutationObserver
  const observer = new MutationObserver(() => {
    detectForms();
    detectPasswordFields();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Form içinde olmayan şifre alanlarını tespit eden fonksiyon
function detectPasswordFields() {
  // Form içinde olmayan tüm şifre alanlarını bul
  const passwordFields = document.querySelectorAll('input[type="password"]:not(form *)');
  
  passwordFields.forEach((passwordField) => {
    if (!passwordField.hasAttribute('data-pw-listener')) {
      passwordField.setAttribute('data-pw-listener', 'true');
      
      // Yakındaki olası kullanıcı adı alanını bul
      const possibleUsernameField = findNearbyUsernameField(passwordField);
      
      // Şifre alanı değişikliğini dinle
      passwordField.addEventListener("input", function() {
        const passwordValue = passwordField.value;
        const usernameValue = possibleUsernameField ? possibleUsernameField.value : "";
        
        if (passwordValue && passwordValue.length > 3) {
          handleCapturedPassword(usernameValue, passwordValue);
        }
      });
      
      // Şifre alanı blur olayını dinle (odak kaybettiğinde)
      passwordField.addEventListener("blur", function() {
        const passwordValue = passwordField.value;
        const usernameValue = possibleUsernameField ? possibleUsernameField.value : "";
        
        if (passwordValue && passwordValue.length > 3) {
          handleCapturedPassword(usernameValue, passwordValue);
        }
      });
    }
  });
}

// Şifre alanının yakınındaki olası kullanıcı adı alanını bul
function findNearbyUsernameField(passwordField) {
  // Aynı container içindeki text veya email inputları ara
  const parent = passwordField.parentElement;
  if (parent) {
    const usernameField = parent.querySelector('input[type="text"], input[type="email"]');
    if (usernameField) return usernameField;
  }
  
  // Bir üst container'a bak
  const grandParent = parent ? parent.parentElement : null;
  if (grandParent) {
    const usernameField = grandParent.querySelector('input[type="text"], input[type="email"]');
    if (usernameField) return usernameField;
  }
  
  // Sayfadaki tüm text/email inputlarını kontrol et ve en yakın olanı bul
  const allUsernameFields = document.querySelectorAll('input[type="text"], input[type="email"]');
  if (allUsernameFields.length > 0) {
    // Basitçe ilk bulunanı döndür
    return allUsernameFields[0];
  }
  
  return null;
}

// Formları tespit edip event listener ekleyen fonksiyon
function detectForms() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const passwordField = form.querySelector('input[type="password"]');
    const usernameField = form.querySelector('input[type="text"], input[type="email"]');

    if (passwordField && usernameField) {
      // Form submit olayını dinle
      if (!form.hasAttribute('data-pw-listener')) {
        form.setAttribute('data-pw-listener', 'true');
        
        form.addEventListener("submit", function(event) {
          const passwordValue = passwordField.value;
          const usernameValue = usernameField.value || "";
          
          if (passwordValue && passwordValue.length > 3) {
            handleCapturedPassword(usernameValue, passwordValue);
          }
        });
        
        // Şifre alanı değişikliğini dinle
        passwordField.addEventListener("input", function() {
          const passwordValue = passwordField.value;
          const usernameValue = usernameField.value || "";
          
          if (passwordValue && passwordValue.length > 3) {
            handleCapturedPassword(usernameValue, passwordValue);
          }
        });
      }
    }
  });
}

// Yakalanan şifreleri işleyecek fonksiyon
function handleCapturedPassword(username, password) {
  console.log("Şifre yakalandı:", username, password, window.location.hostname);
  
  // Modal'ı göster
  showModal(username, password, window.location.hostname);
} 