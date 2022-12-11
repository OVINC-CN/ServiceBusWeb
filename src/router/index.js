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
    path: '/permission/',
    component: () => import('../views/Permission.vue'),
    children: [
      {
        path: '',
        name: 'Permission',
        component: () => import('../views/Permission/Mine.vue')
      },
      {
        path: 'mine/',
        name: 'PermissionMine',
        component: () => import('../views/Permission/Mine.vue')
      },
      {
        path: 'apply/',
        name: 'PermissionApply',
        component: () => import('../views/Permission/Apply.vue')
      },
      {
        path: 'model/',
        name: 'PermissionModel',
        component: () => import('../views/Permission/Model.vue')
      },
      {
        path: 'manage/',
        name: 'PermissionManage',
        component: () => import('../views/Permission/Manage.vue')
      }
    ]
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
