<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/appStore'
import AppointmentFilters from '../appointments/AppointmentFilters.vue'
import AppointmentFormPanel from '../appointments/AppointmentFormPanel.vue'
import AppointmentStats from '../appointments/AppointmentStats.vue'
import AppointmentTable from '../appointments/AppointmentTable.vue'

const appStore = useAppStore()
const { appointmentStats } = storeToRefs(appStore)
</script>

<template>
  <section class="appointments-dashboard">
    <AppointmentStats :stats="appointmentStats" />
    <AppointmentFilters />

    <div class="appointments-grid">
      <AppointmentTable />
      <AppointmentFormPanel />
    </div>
  </section>
</template>
