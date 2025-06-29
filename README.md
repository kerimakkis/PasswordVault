# Password Vault - Vue.js 3 Passwort-Manager

## Projektbeschreibung
Password Vault ist eine webbasierte Anwendung, die es Benutzern ermöglicht, ihre Passwörter sicher zu speichern. Die Anwendung ist mit umfassenden Sicherheitsmaßnahmen wie Benutzerauthentifizierung und verschlüsselter Datenspeicherung ausgestattet. Sie ist responsiv gestaltet und bietet vollständige Offline-Unterstützung.

## Verwendete Technologien
- **Vue.js 3** - Modernes Frontend-Framework
- **Vue Router** - Für die Seitenrouting
- **Dexie.js** - Wrapper für IndexedDB zur clientseitigen Datenspeicherung
- **CryptoJS** - Für Verschlüsselung und Hashing-Funktionen
- **AES-256** - Fortgeschrittener Verschlüsselungsstandard für starken Datenschutz
- **Vite** - Für Projektbau und Entwicklungsumgebung
- **Chrome Extension API** - Für die Browser-Erweiterung (Manifest V3)
- **Vue-toastification** - Für das Benachrichtigungssystem
- **Custom CSS** - Für responsives Design und UI-Komponenten

## Features der Browser-Erweiterung
- **Content Scripts** - Zum Erkennen und Abfangen von Passwortformularen
- **Background Scripts** - Für Hintergrundprozesse und Kommunikation mit der Hauptanwendung
- **Automatische Passworterfassung** - Erkennt Anmeldeversuche auf Websites
- **Nahtlose Integration** - Direkte Verbindung zur Hauptanwendung

## Funktionen
- 🔐 **Sichere Passwortspeicherung** - Passwörter werden stark verschlüsselt gespeichert
- 📲 **Responsive Design** - Flexibles Design, das mit allen Geräten kompatibel ist
- 🔑 **Benutzeranmeldung und Authentifizierung** - Client-seitige Authentifizierung mit Master-Passwort
- 💾 **Browser-Datenbankunterstützung** - Offline-Datenspeicherung mit IndexedDB
- 🛠 **Passwortverwaltung** - Einfache Verwaltung gespeicherter Passwörter
- 🌐 **Browser-Erweiterung** - Automatisches Erfassen von Passwörtern von Websites
- 🔒 **Starke Verschlüsselung mit AES-256** - Alle Daten werden mit dem AES-256-Algorithmus verschlüsselt gespeichert
- 🌙 **Dunkelmodus** - Benutzerfreundliche Darstellung bei schlechten Lichtverhältnissen
- 🔧 **Passwortgenerator** - Erstellung sicherer Passwörter mit verschiedenen Kriterien

## Installation & Nutzung
### 1. Projekt klonen
```bash
git clone https://github.com/kerimakkis/password-vault.git
 cd password-vault
```

### 2. Abhängigkeiten installieren
```bash
 npm install
```

### 3. Entwicklungsumgebung starten
```bash
 npm run dev
```

### 4. Build erstellen (für Deployment)
```bash
 npm run build
```

## Roadmap
- [x] Vue.js 3 Projekt starten (mit Vite)
- [x] Seitenrouting mit Vue Router implementieren
- [x] Benutzerregistrierungs-/Login-Seiten erstellen
- [x] IndexedDB integrieren (mit Dexie.js)
- [x] Sichere Passwortverschlüsselung (CryptoJS / AES-256)
- [x] Passwortspeicherung implementieren
- [x] Responsives Design (Custom CSS)
- [x] Browser-Erweiterung integrieren
- [x] Dunkelmodus hinzufügen
- [x] Passwortgenerator hinzufügen
- [ ] Passwortkategorien implementieren
- [ ] Import/Export-Funktionalität
- [ ] Mehrsprachige Unterstützung (i18n)

## Testbenutzer
**Benutzername:** kerim  
**Master-Passwort:** 12345

## Beitragen
Wenn Sie zum Projekt beitragen möchten, senden Sie bitte einen **Pull Request** oder öffnen Sie ein **Issue**. Jedes Feedback und jeder Vorschlag ist willkommen! 🚀

---

📌 **Lizenz**: Unter der MIT-Lizenz veröffentlicht.

**Kontakt:**
📧 email@example.com | 🌐 [Projektseite](https://github.com/kerimakkis/password-vault)


