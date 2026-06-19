import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Appointments from '../views/Appointments.vue'
import Doctors from '../views/Doctors.vue'
import Patients from '../views/Patients.vue'
import Users from '../views/Users.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'appointments',
      component: Appointments,
      meta: { requiresAuth: true },
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: Doctors,
      meta: { requiresAuth: true },
    },
    {
      path: '/patients',
      name: 'patients',
      component: Patients,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.initializeStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'appointments' })
  } else {
    next()
  }
})

export default router