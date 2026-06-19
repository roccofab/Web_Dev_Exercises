<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createAppointment } from '../../api/post_appointments'

const form = reactive({
  patient: '',
  doctor: '',
  date: '',
  time: '',
  reason: '',
})

const feedback = ref('')

const saveDraft = async () => {
  const doctor = doctors.find((item) => item.id === form.doctorId)
  if(!doctor){
    feedback.value = 'Select doctor'
    return
  }

  const payload = {
    patientName: form.patientName,
    patientFiscalCode: form.patientFiscalCode,
    doctorName: doctor.name,
    doctorSpecialization: doctor.specialization,
    createdById: 1, // temporaneo, poi sostituisci con l’utente loggato
    description: form.reason,
    date: form.date,
    start_time: form.start_time,
    end_time: add30Minutes(form.start_time),
    status: 'SCHEDULED',
  }

  try{
    await createAppointment(payload)
    feedback.value = 'New Appointment Created'
  }catch(error){
    feedback.value = 'Error Creating New Appointment'
  }
}
</script>

<template>
  <section class="form-panel" aria-labelledby="appointment-form-title">
    <div class="panel-header">
      <p>New record</p>
      <h2 id="appointment-form-title">Create appointment</h2>
    </div>

    <form class="appointment-form" @submit.prevent="saveDraft">
      <label>
        <span>Patient</span>
        <input v-model="form.patient" type="text" placeholder="Patient full name" />
      </label>

      <label>
        <span>Doctor</span>
        <select v-model="form.doctor">
          <option value="">Select doctor</option>
          <option value="dr-rossi">Dr. Rossi</option>
          <option value="dr-bianchi">Dr. Bianchi</option>
          <option value="dr-verdi">Dr. Verdi</option>
        </select>
      </label>

      <div class="form-row">
        <label>
          <span>Date</span>
          <input v-model="form.date" type="date" />
        </label>

        <label>
          <span>Time</span>
          <input v-model="form.time" type="time" />
        </label>
      </div>

      <label>
        <span>Reason</span>
        <textarea v-model="form.reason" rows="4" placeholder="Short visit reason"></textarea>
      </label>

      <button type="submit">Save draft</button>
      <p v-if="feedback" class="feedback">{{ feedback }}</p>
    </form>
  </section>
</template>

<style scoped>
.form-panel {
  border: 1px solid #dce5e2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.05);
}

.panel-header {
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

.appointment-form {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.appointment-form label {
  display: grid;
  gap: 8px;
}

.appointment-form span {
  color: #52606d;
  font-size: 0.82rem;
  font-weight: 700;
}

.appointment-form input,
.appointment-form select,
.appointment-form textarea {
  width: 100%;
  border: 1px solid #cbd7d3;
  border-radius: 6px;
  padding: 0 12px;
  color: #182029;
  background: #f8faf9;
}

.appointment-form input,
.appointment-form select {
  min-height: 42px;
}

.appointment-form textarea {
  min-height: 112px;
  padding-top: 10px;
  resize: vertical;
}

.appointment-form input:focus,
.appointment-form select:focus,
.appointment-form textarea:focus {
  border-color: #2f6fed;
  outline: 3px solid rgba(47, 111, 237, 0.14);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.appointment-form button {
  min-height: 44px;
  border: 0;
  border-radius: 6px;
  color: #ffffff;
  font-weight: 800;
  background: #1f7a63;
}

.appointment-form button:hover {
  background: #176550;
}

.feedback {
  margin: 0;
  color: #126244;
  font-size: 0.9rem;
  font-weight: 700;
}

@media (max-width: 520px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
