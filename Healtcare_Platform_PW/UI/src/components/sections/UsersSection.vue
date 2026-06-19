<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchUsers, type UserSectionRow } from '../../api/fetchData'

const users = ref<UserSectionRow[]>([])
const isLoading = ref(true)
const loadError = ref('')

const loadUsers = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    users.value = await fetchUsers()
  } catch {
    loadError.value = 'Unable to load users'
    users.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <section class="resource-section" aria-labelledby="users-title">
    <div class="section-header">
      <button type="button">Add user</button>
    </div>

    <div class="users-table">
      <p v-if="isLoading" class="table-message">Loading users...</p>
      <p v-else-if="loadError" class="table-message table-message--error">{{ loadError }}</p>
      <p v-else-if="users.length === 0" class="table-message">No users found.</p>

      <table v-else>
        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-pill">{{ user.role }}</span>
            </td>
            <td>{{ user.status }}</td>
            <td>
              <button type="button" class="text-action">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.resource-section {
  display: grid;
  gap: 18px;
}

.section-header,
.users-table {
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

.users-table {
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
  min-width: 720px;
  border-collapse: collapse;
}

th,
td {
  padding: 16px 18px;
  border-bottom: 1px solid #edf2f0;
  text-align: left;
}

tbody tr:last-child td {
  border-bottom: 0;
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

.role-pill {
  display: inline-flex;
  min-width: 88px;
  justify-content: center;
  border-radius: 999px;
  padding: 6px 10px;
  color: #2b4f8f;
  font-size: 0.82rem;
  font-weight: 800;
  background: #e6efff;
}

.text-action {
  min-height: 34px;
  border: 1px solid #cbd7d3;
  border-radius: 6px;
  padding: 0 12px;
  color: #1f3447;
  font-weight: 800;
  background: #ffffff;
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
