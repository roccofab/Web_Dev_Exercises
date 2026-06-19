<script setup lang="ts">
type StatTone = 'blue' | 'green' | 'amber' | 'red'

type AppointmentStat = {
  label: string
  value: string
  trend: string
  tone: StatTone
}

defineProps<{
  stats: AppointmentStat[]
}>()
</script>

<template>
  <section class="stats-grid" aria-label="Appointment summary">
    <article
      v-for="stat in stats"
      :key="stat.label"
      class="stat-card"
      :class="`stat-card--${stat.tone}`"
    >
      <p>{{ stat.label }}</p>
      <strong>{{ stat.value }}</strong>
      <span>{{ stat.trend }}</span>
    </article>
  </section>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  min-height: 132px;
  padding: 18px;
  border: 1px solid #dce5e2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(37, 45, 53, 0.06);
}

.stat-card p,
.stat-card span {
  margin: 0;
  color: #65717d;
  font-size: 0.9rem;
}

.stat-card strong {
  display: block;
  margin: 12px 0 8px;
  color: #182029;
  font-size: 2rem;
  line-height: 1;
}

.stat-card--blue {
  border-top: 4px solid #2f6fed;
}

.stat-card--green {
  border-top: 4px solid #1f9d74;
}

.stat-card--amber {
  border-top: 4px solid #c77a13;
}

.stat-card--red {
  border-top: 4px solid #d94c4c;
}

@media (max-width: 980px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
