import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import Appointments from '../views/Appointments.vue'

describe('Appointments', () => {
  it('renders the main workspace', () => {
    const wrapper = mount(Appointments)

    expect(wrapper.text()).toContain('Healthcare Platform')
    expect(wrapper.text()).toContain('Doctors')
    expect(wrapper.text()).toContain('Patients')
    expect(wrapper.text()).toContain('Users')
  })
})
