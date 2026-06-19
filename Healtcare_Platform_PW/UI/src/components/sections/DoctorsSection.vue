<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchDoctors, type DoctorSectionRow } from '../../api/fetchData'

const doctors = ref<DoctorSectionRow[]>([])
const isLoading = ref(true)
const loadError = ref('')

const loadDoctors = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    doctors.value = await fetchDoctors()
  } catch {
    loadError.value = 'Unable to load doctors'
    doctors.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDoctors()
})
</script>

<template>
  <section class="resource-section" aria-labelledby="doctors-title">
    <div class="section-header">
      <button type="button">Add doctor</button>
    </div>

    <p v-if="isLoading" class="section-message">Loading doctors...</p>
    <p v-else-if="loadError" class="section-message section-message--error">{{ loadError }}</p>
    <p v-else-if="doctors.length === 0" class="section-message">No doctors found.</p>

    <div v-else class="doctor-grid">
      <article v-for="doctor in doctors" :key="doctor.id" class="doctor-card">
        <div class="doctor-main">
          <div class="avatar" aria-hidden="true">{{ doctor.name.charAt(0) }}</div>
          <div>
            <h3>{{ doctor.name }}</h3>
            <p>{{ doctor.specialization }}</p>
          </div>
        </div>

        <dl>
          <div>
            <dt>Next slot</dt>
            <dd>{{ doctor.availability }}</dd>
          </div>
          <div>
            <dt>Visits</dt>
            <dd>{{ doctor.appointments }} visits</dd>
          </div>
        </dl>

        <span class="status">{{ doctor.status }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.resource-section {
  display: grid;
  gap: 18px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  padding: 22px;
  border: 1px solid #dce5e2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.05);
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

.section-header button {
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
  border: 1px solid #dce5e2;
  border-radius: 8px;
  color: #52606d;
  font-size: 0.94rem;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.05);
}

.section-message--error {
  color: #9b2c2c;
}

.doctor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.doctor-card {
  display: grid;
  gap: 18px;
  padding: 18px;
  border: 1px solid #dce5e2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.05);
}

.doctor-main {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.avatar {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 50%;
  color: #ffffff;
  font-weight: 900;
  background: #2f6fed;
}

.doctor-main h3,
.doctor-main p {
  margin: 0;
}

.doctor-main h3 {
  color: #182029;
  font-size: 1rem;
}

.doctor-main p {
  margin-top: 4px;
  color: #65717d;
}

dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 0;
}

dt {
  color: #65717d;
  font-size: 0.8rem;
  font-weight: 800;
}

dd {
  margin: 4px 0 0;
  color: #24313d;
  font-weight: 800;
}

.status {
  justify-self: start;
  border-radius: 999px;
  padding: 6px 10px;
  color: #126244;
  font-size: 0.82rem;
  font-weight: 800;
  background: #dff5ec;
}

@media (max-width: 980px) {
  .doctor-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .section-header {
    display: grid;
  }

  .section-header button {
    width: 100%;
  }
}
</style>
