<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const sections = [
  { key: 'appointments', label: 'Appointments', path: '/' },
  { key: 'doctors', label: 'Doctors', path: '/doctors' },
  { key: 'patients', label: 'Patients', path: '/patients' },
  { key: 'users', label: 'Users', path: '/users' },
] as const

const route = useRoute()
const activePath = computed(() => route.path)
const activeSection = computed(
  () => sections.find((section) => section.path === activePath.value)?.key ?? 'appointments',
)
</script>

<template>
  <div class="app-shell">
    <nav class="topbar" aria-label="Main sections">
      <router-link to="/" class="brand">
        <span class="brand-mark">HC</span>
        <span>Healthcare Platform</span>
      </router-link>

      <div class="nav-links">
        <router-link
          v-for="section in sections"
          :key="section.key"
          :to="section.path"
          class="nav-link"
          :class="{ active: activeSection === section.key }"
        >
          {{ section.label }}
        </router-link>
      </div>
    </nav>

    <div class="page-background">
      <slot />
    </div>
  </div>
</template>
