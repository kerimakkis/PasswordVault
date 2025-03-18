import { createApp } from 'vue'
import App from './App.vue'
import router from './Router/index.js'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-toastification/dist/index.css'  


const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    transition: "Vue-Toastification__fade", // Yeni sürüme uygun animasyon
    maxToasts: 5, // Aynı anda gösterilecek maksimum toast sayısı
    newestOnTop: true
})
app.mount('#app')

