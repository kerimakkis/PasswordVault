// Background script - arka planda çalışır
console.log("Password Vault background script başlatıldı");

// Content script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "savePasswordAndRedirect") {
    console.log("Şifre kaydedilecek ve yönlendirilecek:", message.data);
    
    // Yeni sekme açıp dashboard sayfasına yönlendir
    const dashboardUrl = `http://localhost:5173/dashboard?captured=true&username=${encodeURIComponent(message.data.username)}&password=${encodeURIComponent(message.data.password)}&website=${encodeURIComponent(message.data.website)}`;
    
    chrome.tabs.create({ url: dashboardUrl });
    
    // Yanıt gönder
    sendResponse({status: "success"});
  }
  
  // Mesajı işlemeye devam etmek için true döndür
  return true;
}); 