
# Password Vault - Vue.js 3 Password Manager

## Proje Açıklaması
Password Vault, kullanıcıların güvenli bir şekilde şifrelerini saklayabilecekleri bir web tabanlı uygulamadır. Kullanıcı doğrulama (authentication) ve verilerin şifrelenerek saklanması gibi güvenlik önlemleri ile donatılmıştır. Uygulama, mobil uyumlu (responsive) olarak tasarlanmıştır ve offline desteği sunar.

## Kullanılan Teknolojiler
- **Vue.js 3** - Modern frontend framework
- **Vue Router** - Sayfa yönlendirmeleri için
- **Pinia veya Vuex** - State management için (Tercih edilecek)
- **Axios** - API çağrıları için
- **Vue Auth 3** - Kullanıcı doğrulama ve oturum yönetimi için
- **IndexedDB (Dexie.js ile)** - Tarayıcı veritabanı desteği
- **Crypto API (Web Crypto veya CryptoJS)** - Şifrelerin güvenli şekilde saklanması
- **AES-256** - Gelişmiş Şifreleme Standardı (Advanced Encryption Standard) ile güçlü veri koruma
- **Tailwind CSS veya Bootstrap** - Responsive ve modern UI tasarımı
- **Vite** - Proje oluşturma ve geliştirme ortamı

## Özellikler
- 🔐 **Güvenli Şifre Saklama** - Kullanıcının şifreleri güçlü bir şekilde şifrelenerek saklanır.
- 📲 **Mobil Uyumlu (Responsive Design)** - Tüm cihazlara uyumlu, esnek tasarım.
- 🔑 **Kullanıcı Girişi ve Doğrulama** - Vue Auth 3 ile JWT tabanlı authentication.
- 💾 **Tarayıcı Veritabanı Desteği** - IndexedDB kullanarak offline veri saklama.
- 🔄 **Şifre Üretici** - Güçlü ve rastgele şifreler oluşturabilme.
- 🛠 **Kategori Bazlı Şifre Yönetimi** - Şifreleri gruplama ve düzenleme.
- 🌓 **Karanlık Mod (Dark Mode)** - Kullanıcı dostu bir arayüz deneyimi.
- 🏷️ **Not ve Etiketleme Sistemi** - Şifrelere açıklama ve etiket ekleyebilme.
- 🔒 **AES-256 ile Güçlü Şifreleme** - Tüm veriler AES-256 algoritması ile şifrelenerek saklanır.

## Kurulum & Kullanım
### 1. Projeyi Klonlayın
```bash
 git clone https://github.com/kullanici-adiniz/password-vault.git
 cd password-vault
```
### 2. Bağımlılıkları Yükleyin
```bash
 npm install
```
### 3. Geliştirme Ortamını Başlatın
```bash
 npm run dev
```
### 4. Build Alma (Deploy İçin)
```bash
 npm run build
```

## Yol Haritası
- [ ] Vue.js 3 projesi başlatma (Vite ile)
- [ ] Vue Router ile sayfa yönlendirme
- [ ] Kullanıcı kayıt/giriş sayfalarının oluşturulması
- [ ] IndexedDB entegrasyonu (Dexie.js ile)
- [ ] Şifrelerin güvenli şifrelenmesi (Crypto API / AES-256)
- [ ] Kategorilere göre şifreleri saklama
- [ ] Responsive tasarım (Tailwind CSS / Bootstrap)
- [ ] Karanlık Mod ekleme
- [ ] Şifre üretici ekleme
- [ ] Offline desteği ekleme

## Katkıda Bulunma
Projeye katkıda bulunmak istiyorsanız, lütfen bir **pull request** gönderin veya bir **issue** açın. Her türlü geri bildirim ve öneri değerlidir! 🚀

---

📌 **Lisans**: MIT Lisansı altında dağıtılmaktadır.

**İletişim:**
📧 email@example.com | 🌐 [Proje Sayfası](https://github.com/kullanici-adiniz/password-vault)
