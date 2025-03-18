# Password Vault - Vue.js 3 Passwort-Manager

## Projektbeschreibung
Password Vault ist eine webbasierte Anwendung, die es Benutzern ermöglicht, ihre Passwörter sicher zu speichern. Die Anwendung ist mit Sicherheitsmaßnahmen wie Benutzerauthentifizierung und verschlüsselter Datenspeicherung ausgestattet. Sie ist responsiv gestaltet und bietet Offline-Unterstützung.

## Verwendete Technologien
- **Vue.js 3** - Modernes Frontend-Framework
- **Vue Router** - Für die Seitenrouting
- **Pinia oder Vuex** - Für das State Management (wird ausgewählt)
- **Axios** - Für API-Aufrufe
- **Vue Auth 3** - Für Benutzerauthentifizierung und Sitzungsmanagement
- **IndexedDB (mit Dexie.js)** - Browser-Datenbankunterstützung
- **Crypto API (Web Crypto oder CryptoJS)** - Für die sichere Speicherung von Passwörtern
- **AES-256** - Fortgeschrittener Verschlüsselungsstandard (Advanced Encryption Standard) für starken Datenschutz
- **Tailwind CSS oder Bootstrap** - Für responsives und modernes UI-Design
- **Vite** - Für Projektbau und Entwicklungsumgebung

## Funktionen
- 🔐 **Sichere Passwortspeicherung** - Passwörter werden stark verschlüsselt gespeichert.
- 📲 **Responsive Design** - Flexibles Design, das mit allen Geräten kompatibel ist.
- 🔑 **Benutzeranmeldung und Authentifizierung** - JWT-basierte Authentifizierung mit Vue Auth 3.
- 💾 **Browser-Datenbankunterstützung** - Offline-Datenspeicherung mit IndexedDB.
- 🔄 **Passwortgenerator** - Erstellung von starken und zufälligen Passwörtern.
- 🛠 **Kategorienbasierte Passwortverwaltung** - Gruppierung und Verwaltung von Passwörtern nach Kategorien.
- 🌓 **Dunkelmodus** - Benutzerfreundliche Schnittstelle.
- 🏷️ **Notiz- und Etikettierungssystem** - Möglichkeit, Passwörtern Beschreibungen und Etiketten hinzuzufügen.
- 🔒 **Starke Verschlüsselung mit AES-256** - Alle Daten werden mit dem AES-256-Algorithmus verschlüsselt gespeichert.

## Installation & Nutzung
### 1. Klonen Sie das Projekt
```bash
 git clone https://github.com/benutzername/password-vault.git
 cd password-vault
```
### 2. Installieren Sie die Abhängigkeiten
```bash
 npm install
```
### 3. Starten Sie die Entwicklungsumgebung
```bash
 npm run dev
```
### 4. Erstellen Sie ein Build (für Deployment)
```bash
 npm run build
```

## Roadmap
- [ ] Starten eines Vue.js 3 Projekts (mit Vite)
- [ ] Seitenrouting mit Vue Router
- [ ] Erstellung von Benutzerregistrierungs-/Login-Seiten
- [ ] Integration von IndexedDB (mit Dexie.js)
- [ ] Sichere Verschlüsselung von Passwörtern (Crypto API / AES-256)
- [ ] Speicherung von Passwörtern nach Kategorien
- [ ] Responsives Design (Tailwind CSS / Bootstrap)
- [ ] Hinzufügen eines Dunkelmodus
- [ ] Hinzufügen eines Passwortgenerators
- [ ] Hinzufügen von Offline-Unterstützung

## Beitrag
Wenn Sie zum Projekt beitragen möchten, senden Sie bitte einen **Pull Request** oder öffnen Sie ein **Issue**. Jedes Feedback und jeder Vorschlag ist willkommen! 🚀

---

📌 **Lizenz**: Unter der MIT-Lizenz veröffentlicht.

**Kontakt:**
📧 email@example.com | 🌐 [Projektseite](https://github.com/benutzername/password-vault)
