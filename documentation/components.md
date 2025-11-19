# Components API Documentation

## PasswordGenerator.vue

**Description:**
Component for generating secure passwords with customizable options (length, character types) and presets.

**Props:**
None

**Events:**
- `password-generated`: Emitted when a new password is generated. Payload: `password` (string).

**Methods:**
- `generatePassword()`: Generates a new password based on current settings.
- `copyToClipboard(text)`: Copies the given text to clipboard.
- `applyPreset(preset)`: Applies a predefined configuration preset.

---

## CategoryManager.vue

**Description:**
Component for managing password categories. Allows creating, updating, and deleting categories.

**Props:**
None

**Events:**
None

**Methods:**
- `openAddModal()`: Opens the modal to add a new category.
- `openEditModal(category)`: Opens the modal to edit an existing category.
- `saveCategory()`: Saves the new or updated category to the database.
- `deleteCategory(id)`: Deletes a category by ID.

---

## ImportExport.vue

**Description:**
Component for importing and exporting password data. Supports CSV and JSON formats.

**Props:**
None

**Events:**
None

**Methods:**
- `exportToCSV()`: Exports all passwords to a CSV file.
- `exportToJSON()`: Exports all passwords to a JSON file.
- `handleFileUpload(event)`: Handles file selection for import.
- `importFile()`: Processes the selected file and imports passwords.
