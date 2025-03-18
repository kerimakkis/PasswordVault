// Chrome uzantısı ile ana uygulama arasında iletişim kuracak content script

// AutoCapture fonksiyonlarını içe aktarın
export function observeLoginForms(onPasswordCaptured) {
  // Sayfa yüklendiğinde mevcut formları ve şifre alanlarını kontrol et
  setTimeout(() => {
    detectForms(onPasswordCaptured);
    detectPasswordFields(onPasswordCaptured);
  }, 1000); // Sayfa yüklendikten sonra çalıştır

  // Yeni eklenen inputları takip etmek için MutationObserver
  const observer = new MutationObserver(() => {
    detectForms(onPasswordCaptured);
    detectPasswordFields(onPasswordCaptured);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// 📌 Form içinde olmayan şifre alanlarını tespit eden fonksiyon
function detectPasswordFields(onPasswordCaptured) {
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
          onPasswordCaptured(usernameValue, passwordValue, window.location.hostname);
        }
      });
      
      // Şifre alanı blur olayını dinle (odak kaybettiğinde)
      passwordField.addEventListener("blur", function() {
        const passwordValue = passwordField.value;
        const usernameValue = possibleUsernameField ? possibleUsernameField.value : "";
        
        if (passwordValue && passwordValue.length > 3) {
          onPasswordCaptured(usernameValue, passwordValue, window.location.hostname);
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

// 📌 Formları tespit edip event listener ekleyen fonksiyon
function detectForms(onPasswordCaptured) {
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
            onPasswordCaptured(usernameValue, passwordValue, window.location.hostname);
          }
        });
        
        // Şifre alanı değişikliğini dinle
        passwordField.addEventListener("input", function() {
          const passwordValue = passwordField.value;
          const usernameValue = usernameField.value || "";
          
          if (passwordValue && passwordValue.length > 3) {
            onPasswordCaptured(usernameValue, passwordValue, window.location.hostname);
          }
        });
      }
    }
  });
}

// Chrome uzantısı API'lerini kontrol et ve kullan
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "passwordCaptured") {
      // Chrome storage'a kaydet
      chrome.storage.local.set({ 
        capturedData: message.data,
        showSavePrompt: true 
      });
    }
  });
}
  