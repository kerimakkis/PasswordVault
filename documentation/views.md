# Views API Documentation

## LoginView.vue

**Description:**
Handles user authentication (Login and Registration).

**Route:** `/login`

**Features:**
- User Registration with master password.
- User Login with username and master password.
- Quick login for test user (Dev mode).
- List of registered users for easy selection.

**Methods:**
- `login()`: Authenticates the user against the database.
- `register()`: Creates a new user account.
- `quickLogin()`: Auto-fills credentials for test user.

---

## DashboardView.vue

**Description:**
The main application interface for managing passwords.

**Route:** `/dashboard` (Requires Authentication)

**Features:**
- List all saved passwords.
- Filter passwords by category.
- Add new passwords.
- Edit/Delete existing passwords.
- Generate new secure passwords.
- Import/Export data.
- Auto-capture password integration.

**Methods:**
- `fetchPasswords()`: Retrieves passwords from the database.
- `addPassword()`: Adds a new password entry.
- `updatePassword()`: Updates an existing password entry.
- `deletePassword(id)`: Deletes a password entry.
- `decryptStoredPassword(record)`: Decrypts and shows a password.

---

## HomeView.vue

**Description:**
Landing page of the application.

**Route:** `/`

**Features:**
- Introduction to the application.
- "Get Started" button that redirects to Login or Dashboard based on auth state.

**Methods:**
- `navigateBasedOnAuth()`: Checks login status and redirects accordingly.
