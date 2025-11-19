import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../utils/db';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import LoginView from '../views/LoginView.vue';

/**
 * Vue Router configuration.
 * Defines routes and navigation history mode.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
});

// Yönlendirme koruması
// Yönlendirme koruması
/**
 * Global navigation guard.
 * Checks if the route requires authentication and redirects to login if necessary.
 */
router.beforeEach((to, from, next) => {
  // Oturum gerektiren sayfalar için kontrol
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.isLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
