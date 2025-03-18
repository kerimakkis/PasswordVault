import Dexie from 'dexie';

export const db = new Dexie('PasswordVault');
db.version(1).stores({
  passwords: '++id, website, username, encryptedPassword'
});
