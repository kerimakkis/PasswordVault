// Background script - arka planda çalışır
console.log("Password Vault background script başlatıldı");

// Content script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background'da mesaj alındı:", message.action);
  
  if (message.action === "savePassword") {
    const data = message.data;
    console.log("Şifre kaydedilecek:", data.username, "******", data.website);
    
    // Dashboard'a yönlendir ve parametreleri aktar
    const dashboardUrl = `http://localhost:5173/dashboard?captured=true&username=${encodeURIComponent(data.username)}&password=${encodeURIComponent(data.password)}&website=${encodeURIComponent(data.website)}`;
    
    // Yeni sekme aç
    chrome.tabs.create({ url: dashboardUrl }, (tab) => {
      console.log("Dashboard sekmesi açıldı:", tab.id);
      sendResponse({ status: "success", tabId: tab.id });
    });
    
    // Asenkron yanıt için true döndür
    return true;
  }
});

// Browser Action (toolbar icon) tıklaması
chrome.action.onClicked.addListener((tab) => {
  // Dashboard sayfasını aç
  chrome.tabs.create({ url: "http://localhost:5173/dashboard" });
}); 