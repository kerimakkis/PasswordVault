import CryptoJS from "crypto-js";

// Rastgele salt oluştur
/**
 * Generates a random salt.
 * @param {number} [length=16] - The length of the salt.
 * @returns {string} The generated salt.
 */
export function generateSalt(length = 16) {
  return CryptoJS.lib.WordArray.random(length).toString();
}

// Şifre hash'leme (kullanıcı master password hash'lemek için)
/**
 * Hashes a password using PBKDF2.
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt to use.
 * @returns {string} The hashed password.
 */
export function hashPassword(password, salt) {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iterations: 1000
  }).toString();
}

// Master password ile şifre şifreleme
/**
 * Encrypts a password using AES.
 * @param {string} password - The password to encrypt.
 * @param {string} masterPassword - The master password to use as the key.
 * @returns {string} The encrypted password.
 */
export function encryptPassword(password, masterPassword) {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
}

// Master password ile şifre çözme
/**
 * Decrypts an encrypted password using AES.
 * @param {string} encryptedPassword - The encrypted password.
 * @param {string} masterPassword - The master password to use as the key.
 * @returns {string} The decrypted password.
 */
export function decryptPassword(encryptedPassword, masterPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
}
