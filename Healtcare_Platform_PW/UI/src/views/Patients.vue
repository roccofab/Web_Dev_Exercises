<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import PatientsSection from '../components/sections/PatientsSection.vue'

const appStore = useAppStore()

</script>

<template>
  <div class="page-shell">
    <header class="page-header">
      <div></div>
    </header>

    <PatientsSection />
  </div>
</template>
