<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import DoctorsSection from '../components/sections/DoctorsSection.vue'

const appStore = useAppStore()

</script>

<template>
  <div class="page-shell">
    <header class="page-header">
      <div></div>
    </header>

    <DoctorsSection />
  </div>
</template>
