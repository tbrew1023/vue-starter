import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Original from '../views/Original.vue'
import About from '../views/About.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/original',
    name: 'Original',
    component: Original
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  store.commit('togglePane');
  setTimeout(() => {
    store.commit('closeModal');
    store.commit('togglePane');
    next();
  }, 600);
});

export default router
