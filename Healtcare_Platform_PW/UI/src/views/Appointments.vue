<script setup lang="ts">
import AppointmentsSection from '../components/sections/AppointmentsSection.vue'


</script>

<template>
  <div class="page-shell">
    <header class="page-header">
      <div></div>

      <div class="header-actions">
        <button type="button" class="secondary-button">Export</button>
        <button type="button" class="primary-button">New appointment</button>
      </div>
    </header>

    <AppointmentsSection />
  </div>
</template>
