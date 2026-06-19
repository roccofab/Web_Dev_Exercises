<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchDoctors } from '../../api/fetchData'

type DoctorOption = {
  id: number
  name: string
}

const searchTerm = ref('')
const selectedDate = ref('')
const selectedDoctorId = ref<'all' | number>('all')
const doctors = ref<DoctorOption[]>([])

const loadDoctors = async () => {
  doctors.value = await fetchDoctors()
}

onMounted(() => {
  loadDoctors()
})

const resetFilters = () => {
  searchTerm.value = ''
  selectedDate.value = ''
  selectedDoctorId.value = 'all'
}
</script>

<template>
  <section class="filters-panel" aria-label="Appointment filters">
    <label class="field field--search">
      <span>Search</span>
      <input v-model="searchTerm" type="search" placeholder="Patient, doctor" />
    </label>

    <label class="field">
      <span>Date</span>
      <input v-model="selectedDate" type="date" />
    </label>

    <label class="field">
      <span>Doctor</span>
      <select v-model="selectedDoctorId">
        <option value="all">All doctors</option>
        <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
          {{ doctor.name }}
        </option>
      </select>
    </label>

    <button type="button" class="secondary-action" @click="resetFilters">Reset</button>
  </section>
</template>

<style scoped>
.filters-panel {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 180px 220px auto;
  gap: 12px;
  align-items: end;
  padding: 16px;
  border: 1px solid #dce5e2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.05);
}

.field {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.field span {
  color: #52606d;
  font-size: 0.82rem;
  font-weight: 700;
}

.field input,
.field select {
  width: 100%;
  min-height: 42px;
  border: 1px solid #cbd7d3;
  border-radius: 6px;
  padding: 0 12px;
  color: #182029;
  background: #f8faf9;
}

.field input:focus,
.field select:focus {
  border-color: #2f6fed;
  outline: 3px solid rgba(47, 111, 237, 0.14);
}

.secondary-action {
  min-height: 42px;
  border: 1px solid #cbd7d3;
  border-radius: 6px;
  padding: 0 16px;
  color: #1f3447;
  font-weight: 700;
  background: #ffffff;
}

.secondary-action:hover {
  background: #eef5f3;
}

@media (max-width: 900px) {
  .filters-panel {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 620px) {
  .filters-panel {
    grid-template-columns: 1fr;
  }
}
</style>
