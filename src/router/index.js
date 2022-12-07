import * as vueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/user/',
    name: 'User',
    component: () => import('../views/UserProfile.vue'),
  },
  {
    path: '/app/',
    name: 'Application',
    component: () => import('../views/Application.vue'),
  },
  {

    path: '/:pathMatch(.*)*',
    name: 'Notfound',
    component: () => import('../views/Error404.vue'),
  },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes,
});

export default router;
