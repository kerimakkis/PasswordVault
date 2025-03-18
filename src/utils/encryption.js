import CryptoJS from "crypto-js";

// AES-256 ile şifreleme fonksiyonu
export function encryptPassword(password, masterKey) {
  return CryptoJS.AES.encrypt(password, masterKey).toString();
}

// AES-256 ile şifreyi çözme fonksiyonu
export function decryptPassword(encryptedPassword, masterKey) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
}
