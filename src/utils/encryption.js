import CryptoJS from "crypto-js";

// Rastgele salt oluştur
export function generateSalt(length = 16) {
  return CryptoJS.lib.WordArray.random(length).toString();
}

// Şifre hash'leme (kullanıcı master password hash'lemek için)
export function hashPassword(password, salt) {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iterations: 1000
  }).toString();
}

// Master password ile şifre şifreleme
export function encryptPassword(password, masterPassword) {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
}

// Master password ile şifre çözme
export function decryptPassword(encryptedPassword, masterPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
}
