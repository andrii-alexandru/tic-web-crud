import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/my-account',
      name: 'my-account',
      component: () => import('../views/MyAccount.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesQuotes.vue')
    },
    {
      path: '/quotes',
      name: 'quotes',
      component: () => import('../views/AllQuotes.vue')
    },
    {
      path: '/authors',
      name: 'authors',
      component: () => import('../views/AllAuthors.vue')
    },
    {
      path: '/create-quote',
      name: 'create-quote',
      component: () => import('../views/CreateQuote.vue')
    },
    {
      path: '/create-author',
      name: 'create-author',
      component: () => import('../views/CreateAuthor.vue')
    },
    // Wildcard route for 404
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

export default router
