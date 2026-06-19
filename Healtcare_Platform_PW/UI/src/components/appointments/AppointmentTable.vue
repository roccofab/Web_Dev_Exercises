<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchAppointments, type AppointmentTableRow } from '../../api/fetchData'

const appointments = ref<AppointmentTableRow[]>([])
const isLoading = ref(true)
const loadError = ref('')

const loadAppointments = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    appointments.value = await fetchAppointments()
  } catch {
    loadError.value = 'Unable to load appointments'
    appointments.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAppointments()
})
</script>

<template>
  <section class="table-panel" aria-labelledby="appointments-table-title">
    <div class="panel-header">
      <div>
        <p>Schedule</p>
        <h2 id="appointments-table-title">Upcoming appointments</h2>
      </div>
      <button type="button">View all</button>
    </div>

    <div class="table-scroll">
      <p v-if="isLoading" class="table-message">Loading appointments...</p>
      <p v-else-if="loadError" class="table-message table-message--error">{{ loadError }}</p>
      <p v-else-if="appointments.length === 0" class="table-message">No appointments found.</p>

      <table v-else>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Patient</th>
            <th scope="col">Fiscal Code</th>
            <th scope="col">Doctor</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id">
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.patient }}</td>
            <td>{{ appointment.patientFiscalCode }}</td>
            <td>{{ appointment.doctor }}</td>
            <td>
              <span class="status-pill" :class="`status-pill--${appointment.statusClass}`">
                {{ appointment.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.table-panel {
  min-width: 0;
  border: 1px solid #dce5e2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 18px;
  border-bottom: 1px solid #e6eeeb;
}

.panel-header p,
.panel-header h2 {
  margin: 0;
}

.panel-header p {
  color: #65717d;
  font-size: 0.86rem;
  font-weight: 700;
}

.panel-header h2 {
  margin-top: 4px;
  color: #182029;
  font-size: 1.2rem;
}

.panel-header button {
  min-height: 38px;
  border: 1px solid #cbd7d3;
  border-radius: 6px;
  padding: 0 14px;
  color: #1f3447;
  font-weight: 700;
  background: #ffffff;
  white-space: nowrap;
}

.table-scroll {
  overflow-x: auto;
}

.table-message {
  margin: 0;
  padding: 24px 18px;
  color: #52606d;
  font-size: 0.94rem;
}

.table-message--error {
  color: #9b2c2c;
}

table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
}

th,
td {
  padding: 16px 18px;
  border-bottom: 1px solid #edf2f0;
  text-align: left;
  vertical-align: middle;
}

th {
  color: #52606d;
  font-size: 0.82rem;
  font-weight: 800;
}

td {
  color: #24313d;
  font-size: 0.94rem;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.status-pill {
  display: inline-flex;
  min-width: 92px;
  justify-content: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.82rem;
  font-weight: 800;
}

.status-pill--confirmed {
  color: #126244;
  background: #dff5ec;
}

.status-pill--pending {
  color: #8a520d;
  background: #fff2d8;
}

.status-pill--completed {
  color: #2b4f8f;
  background: #e6efff;
}

.status-pill--canceled {
  color: #8f2b2b;
  background: #fde8e8;
}
</style>
