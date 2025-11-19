import { createApp } from 'vue'
import App from './App.vue'
import router from './Router/index.js'
import { createPinia } from 'pinia'
import VueToastification from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { i18n } from './i18n'
import './style.css' // Our custom styles should come last to override Bootstrap

/**
 * Initialize the Vue application.
 * Sets up plugins (Router, Pinia, i18n, Toast) and mounts the app.
 */
const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(i18n)
app.use(VueToastification, {
    position: 'top-right',
    timeout: 3000,
    maxToasts: 5, // Aynı anda gösterilecek maksimum toast sayısı
    newestOnTop: true
})
app.mount('#app')

