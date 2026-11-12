// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PacientesView from '../views/PacientesView.vue'; // CORREGIDO

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: PacientesView
    }
    // Puedes agregar más rutas después
  ]
});

export default router;