<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPatientByFiscalCode, fetchPatients, type PatientSectionRow } from '../../api/fetchData'

const fiscalCode = ref('')
const patients = ref<PatientSectionRow[]>([])
const isLoading = ref(true)
const loadError = ref('')

const loadPatients = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const searchTerm = fiscalCode.value.trim()
    patients.value = searchTerm
      ? await fetchPatientByFiscalCode(searchTerm)
      : await fetchPatients()
  } catch {
    loadError.value = 'Unable to load patients'
    patients.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPatients()
})
</script>

<template>
  <section class="resource-section" aria-labelledby="patients-title">
    <div class="section-header">
      <button type="button">Add patient</button>
    </div>

    <div class="search-panel">
      <label>
        <span>Fiscal code</span>
        <input
          v-model="fiscalCode"
          type="search"
          placeholder="Search fiscal code"
          @keyup.enter="loadPatients"
        />
      </label>
      <button type="button" @click="loadPatients">Search</button>
    </div>

    <p v-if="isLoading" class="section-message">Loading patients...</p>
    <p v-else-if="loadError" class="section-message section-message--error">{{ loadError }}</p>
    <p v-else-if="patients.length === 0" class="section-message">No patients found.</p>

    <div v-else class="patient-list" aria-label="Recent patients">
      <article v-for="patient in patients" :key="patient.id" class="patient-row">
        <div>
          <h3>{{ patient.name }}</h3>
          <p>{{ patient.fiscalCode }}</p>
        </div>
        <span>{{ patient.phone }}</span>
        <strong>Last visit: {{ patient.lastVisit }}</strong>
      </article>
    </div>
  </section>
</template>

<style scoped>
.resource-section {
  display: grid;
  gap: 18px;
}

.section-header,
.search-panel,
.patient-list,
.section-message {
  border: 1px solid #dce5e2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  padding: 22px;
}

.section-header p,
.section-header h2,
.section-header span {
  margin: 0;
}

.section-header p {
  color: #65717d;
  font-size: 0.86rem;
  font-weight: 800;
}

.section-header h2 {
  margin-top: 4px;
  color: #182029;
  font-size: 1.55rem;
}

.section-header span {
  display: block;
  margin-top: 8px;
  color: #52606d;
}

.section-header button,
.search-panel button {
  min-height: 42px;
  border: 0;
  border-radius: 6px;
  padding: 0 16px;
  color: #ffffff;
  font-weight: 800;
  background: #1f7a63;
  white-space: nowrap;
}

.section-message {
  margin: 0;
  padding: 24px 22px;
  color: #52606d;
  font-size: 0.94rem;
}

.section-message--error {
  color: #9b2c2c;
}

.search-panel {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: 12px;
  align-items: end;
  padding: 16px;
}

.search-panel label {
  display: grid;
  gap: 8px;
}

.search-panel span {
  color: #52606d;
  font-size: 0.82rem;
  font-weight: 700;
}

.search-panel input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #cbd7d3;
  border-radius: 6px;
  padding: 0 12px;
  color: #182029;
  background: #f8faf9;
}

.search-panel input:focus {
  border-color: #2f6fed;
  outline: 3px solid rgba(47, 111, 237, 0.14);
}

.patient-list {
  overflow: hidden;
}

.patient-row {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) minmax(160px, 0.8fr) minmax(160px, 0.8fr);
  gap: 16px;
  align-items: center;
  padding: 18px;
  border-bottom: 1px solid #edf2f0;
}

.patient-row:last-child {
  border-bottom: 0;
}

.patient-row h3,
.patient-row p {
  margin: 0;
}

.patient-row h3 {
  color: #182029;
  font-size: 1rem;
}

.patient-row p,
.patient-row span {
  color: #65717d;
}

.patient-row p {
  margin-top: 4px;
}

.patient-row strong {
  color: #24313d;
  font-size: 0.92rem;
}

@media (max-width: 760px) {
  .section-header,
  .search-panel,
  .patient-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    display: grid;
  }

  .section-header button,
  .search-panel button {
    width: 100%;
  }
}
</style>
