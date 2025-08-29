import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes';
import { setupLayouts } from 'virtual:generated-layouts';
import { useAppAuthStore } from '@/stores/app-auth';

export const router = createRouter({
    history: createWebHistory(),
    routes: setupLayouts(routes),
})

router.beforeEach((to, _from, next) => {
    const appAuthStore = useAppAuthStore();
    const isAuthenticated = appAuthStore.isAuthenticated;
    const userRole = appAuthStore.user.role;

    const requiresAuth = to.meta.requiresAuth;
    const requiresAdmin = to.meta.requiresAdmin;

    // Handle authentication
    if (requiresAuth && !isAuthenticated) {
        next({ name: '/login' });
        return;
    }

    // Handle admin authorization
    if (requiresAdmin && userRole !== 'admin') {
        next({ name: '/403' });
        return;
    }

    // Redirect authenticated users from login page
    if (isAuthenticated && (to.name === '/login' || to.name === '/')) {
        next({ name: '/dashboard/' });
        return;
    }

    next();
})