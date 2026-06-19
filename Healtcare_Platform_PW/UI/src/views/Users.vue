<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import UsersSection from '../components/sections/UsersSection.vue'

const appStore = useAppStore()

</script>

<template>
  <div class="page-shell">
    <header class="page-header">
      <div></div>
    </header>

    <UsersSection />
  </div>
</template>
