import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes';
import { setupLayouts } from 'virtual:generated-layouts';

export const router = createRouter({
    history: createWebHistory(),
    routes: setupLayouts(routes),
})

router.beforeEach((to,_from,next) => {
    const appAuthStore = useAppAuthStore();
    const isAuthenticated = appAuthStore.isAuthenticated;

    const requiresAuth = to.meta.requiresAuth;
    if (requiresAuth && !isAuthenticated) {
        next({ name: '/login' });
        return;
    }
    if (isAuthenticated && (to.name === '/login' || to.name === '/')) {
        next({ name: '/dashboard/' });
        return;
    }

    next();
})