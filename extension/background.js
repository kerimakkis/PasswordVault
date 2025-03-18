// Background script - arka planda çalışır
console.log("Password Vault background script başlatıldı");

// Content script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "passwordCaptured") {
    console.log("Şifre yakalandı:", message.data);
    
    // Kullanıcıya şifreyi kaydetmek isteyip istemediğini sor
    chrome.storage.local.set({ 
      capturedData: message.data,
      showSavePrompt: true 
    });
    
    // Ana uygulamaya yönlendir
    chrome.tabs.create({ url: "http://localhost:5173/dashboard" });
  }
}); 