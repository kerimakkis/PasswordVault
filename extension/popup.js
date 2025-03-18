// Popup script
document.getElementById('openDashboard').addEventListener('click', function() {
  chrome.tabs.create({ url: 'http://localhost:5173/dashboard' });
}); 