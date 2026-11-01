import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmSelect from './MmSelect.vue'

const options = [
  { label: 'Alice', value: 'user-1' },
  { label: 'Bob', value: 'user-2' },
  { label: 'Charlie', value: 'user-3', disabled: true },
]

function createWrapper(props: Partial<InstanceType<typeof MmSelect>['$props']> = {}) {
  return mount(MmSelect, {
    props: {
      label: 'Jellyfin user',
      options,
      ...props,
    },
  })
}

describe('MmSelect', () => {
  describe('rendering', () => {
    it('renders its label', () => {
      const wrapper = createWrapper()
      expect(wrapper.get('.select-field__label').text()).toBe('Jellyfin user')
    })

    it('associates its label and visible value with the trigger', () => {
      const wrapper = createWrapper({ modelValue: 'user-1' })
      const label = wrapper.get('.select-field__label')
      const value = wrapper.get('.select-field__value')
      const trigger = wrapper.get('.select-field__trigger')

      expect(trigger.attributes('aria-labelledby')).toBe(
        `${label.attributes('id')} ${value.attributes('id')}`,
      )
      expect(value.text()).toBe('Alice')
    })

    it('renders the placeholder when nothing is selected', () => {
      const wrapper = createWrapper({ placeholder: 'Select a user' })
      expect(wrapper.get('.select-field__value').text()).toBe('Select a user')
    })

    it('renders the fallback placeholder when none is provided', () => {
      const wrapper = createWrapper()
      expect(wrapper.get('.select-field__value').text()).toBe('Select an option')
    })

    it('displays the selected option label', () => {
      const wrapper = createWrapper({ modelValue: 'user-2' })
      expect(wrapper.get('.select-field__value').text()).toBe('Bob')
    })

    it('renders all options when opened', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      const renderedOptions = wrapper.findAll('[role="option"]')

      expect(renderedOptions).toHaveLength(3)
      expect(renderedOptions.map((option) => option.text())).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('does not render the dropdown while closed', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('does not open the dropdown when no options are available', async () => {
      const wrapper = createWrapper({ options: [] })

      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(wrapper.get('.select-field__trigger').attributes('aria-expanded')).toBe('false')
      expect(wrapper.get('.select-field__value').text()).toBe('Select an option')
    })

    it('reacts when its model value changes', async () => {
      const wrapper = createWrapper({ modelValue: 'user-1' })
      expect(wrapper.get('.select-field__value').text()).toBe('Alice')

      await wrapper.setProps({ modelValue: 'user-2' })

      expect(wrapper.get('.select-field__value').text()).toBe('Bob')
    })

    it('reacts when its options change', async () => {
      const wrapper = createWrapper()
      await wrapper.setProps({
        options: [{ label: 'Diana', value: 'user-4' }],
      })

      await wrapper.get('.select-field__trigger').trigger('click')

      const renderedOptions = wrapper.findAll('[role="option"]')

      expect(renderedOptions).toHaveLength(1)
      expect(renderedOptions[0]?.text()).toBe('Diana')
    })
  })

  describe('selection', () => {
    it('opens the dropdown when clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      expect(wrapper.get('.select-field__trigger').attributes('aria-expanded')).toBe('true')
    })

    it('closes the dropdown when clicked again', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')
      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(wrapper.get('.select-field__trigger').attributes('aria-expanded')).toBe('false')
    })

    it('emits an update when an option is selected', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')
      await wrapper.findAll('[role="option"]')[1]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['user-2'])
    })

    it('closes the dropdown after selecting an option', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')
      await wrapper.get('[role="option"]').trigger('click')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('marks the selected option', async () => {
      const wrapper = createWrapper({ modelValue: 'user-2' })
      await wrapper.get('.select-field__trigger').trigger('click')

      const renderedOptions = wrapper.findAll('[role="option"]')

      expect(renderedOptions[0]?.attributes('aria-selected')).toBe('false')
      expect(renderedOptions[1]?.attributes('aria-selected')).toBe('true')
      expect(renderedOptions[2]?.attributes('aria-selected')).toBe('false')
    })

    it('does not emit an update when opening the dropdown', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('disabled and loading states', () => {
    it('supports disabled options', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      const disabledOption = wrapper.findAll('[role="option"]')[2]

      expect(disabledOption?.attributes('disabled')).toBeDefined()
      expect(disabledOption?.attributes('aria-disabled')).toBe('true')
    })

    it('supports disabled fields', () => {
      const wrapper = createWrapper({ disabled: true })
      expect(wrapper.get('.select-field__trigger').attributes('disabled')).toBeDefined()
    })

    it('does not open when disabled', async () => {
      const wrapper = createWrapper({ disabled: true })
      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('disables the dropdown while loading', () => {
      const wrapper = createWrapper({ loading: true })
      const trigger = wrapper.get('.select-field__trigger')

      expect(trigger.attributes('disabled')).toBeDefined()
      expect(trigger.attributes('aria-busy')).toBe('true')
      expect(wrapper.get('.select-field__value').text()).toBe('Loading...')
    })

    it('does not mark the trigger as busy by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.get('.select-field__trigger').attributes('aria-busy')).toBeUndefined()
    })

    it('closes an open dropdown when disabled', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

      await wrapper.setProps({ disabled: true })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('validation and accessibility', () => {
    it('supports required fields', () => {
      const wrapper = createWrapper({ required: true })
      expect(wrapper.get('.select-field__required').text()).toBe('*')
    })

    it('does not show a required indicator by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.select-field__required').exists()).toBe(false)
    })

    it('displays a hint associated with the trigger', () => {
      const wrapper = createWrapper({
        hint: 'Watched media will be hidden for this user.',
      })

      const hint = wrapper.get('.select-field__hint')
      const trigger = wrapper.get('.select-field__trigger')

      expect(hint.text()).toBe('Watched media will be hidden for this user.')
      expect(trigger.attributes('aria-describedby')).toContain(hint.attributes('id'))
    })

    it('displays an error associated with the trigger', () => {
      const wrapper = createWrapper({
        error: 'Could not load Jellyfin users.',
      })

      const error = wrapper.get('.select-field__error')
      const trigger = wrapper.get('.select-field__trigger')

      expect(error.text()).toBe('Could not load Jellyfin users.')
      expect(error.attributes('role')).toBe('alert')
      expect(trigger.attributes('aria-invalid')).toBe('true')
      expect(trigger.attributes('aria-describedby')).toContain(error.attributes('id'))
    })

    it('associates both hint and error with the trigger', () => {
      const wrapper = createWrapper({
        hint: 'Choose your Jellyfin account.',
        error: 'Selection is required.',
      })

      const describedBy = wrapper.get('.select-field__trigger').attributes('aria-describedby')

      expect(describedBy).toContain(wrapper.get('.select-field__hint').attributes('id'))
      expect(describedBy).toContain(wrapper.get('.select-field__error').attributes('id'))
    })

    it('does not mark valid selects as invalid', () => {
      const wrapper = createWrapper()
      expect(wrapper.get('.select-field__trigger').attributes('aria-invalid')).toBeUndefined()
    })

    it('supports the name attribute through a hidden input', () => {
      const wrapper = createWrapper({
        name: 'jellyfinUser',
        modelValue: 'user-2',
      })

      const input = wrapper.get('input[type="hidden"]')

      expect(input.attributes('name')).toBe('jellyfinUser')
      expect(input.attributes('value')).toBe('user-2')
    })

    it('does not render a hidden input without a name', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
    })

    it('generates unique IDs within the same application', () => {
      const wrapper = mount({
        components: { MmSelect },
        setup() {
          return { options }
        },
        template: `
          <div>
            <MmSelect label="First user" :options="options" />
            <MmSelect label="Second user" :options="options" />
          </div>
        `,
      })

      const triggers = wrapper.findAll('.select-field__trigger')

      expect(triggers).toHaveLength(2)

      const firstId = triggers[0]?.attributes('id')
      const secondId = triggers[1]?.attributes('id')

      expect(firstId).toBeDefined()
      expect(secondId).toBeDefined()
      expect(firstId).not.toBe(secondId)
    })

    it('forwards accessibility attributes to the trigger', () => {
      const wrapper = mount(MmSelect, {
        props: {
          label: 'Jellyfin user',
          options,
        },
        attrs: {
          'aria-label': 'Select Jellyfin account',
        },
      })

      expect(wrapper.get('.select-field__trigger').attributes('aria-label')).toBe(
        'Select Jellyfin account',
      )
    })

    it('does not reference a missing listbox while closed', () => {
      const wrapper = createWrapper()
      const trigger = wrapper.get('.select-field__trigger')

      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(trigger.attributes('aria-controls')).toBeUndefined()
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('exposes the listbox relationship while open', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      const trigger = wrapper.get('.select-field__trigger')
      const listbox = wrapper.get('[role="listbox"]')

      expect(trigger.attributes('aria-haspopup')).toBe('listbox')
      expect(trigger.attributes('aria-controls')).toBe(listbox.attributes('id'))
    })

    it('removes the listbox reference after closing', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.get('.select-field__trigger').attributes('aria-controls')).toBeDefined()

      await wrapper.get('.select-field__trigger').trigger('click')

      expect(wrapper.get('.select-field__trigger').attributes('aria-controls')).toBeUndefined()
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('keyboard navigation', () => {
    it('opens with ArrowDown', async () => {
      const wrapper = createWrapper()

      await wrapper.get('.select-field__trigger').trigger('keydown', {
        key: 'ArrowDown',
      })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    })

    it('opens with ArrowUp', async () => {
      const wrapper = createWrapper()

      await wrapper.get('.select-field__trigger').trigger('keydown', {
        key: 'ArrowUp',
      })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    })

    it('closes with Escape', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      await wrapper.get('[role="option"]').trigger('keydown', {
        key: 'Escape',
      })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('selects an option with Enter', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      await wrapper.get('[role="option"]').trigger('keydown', {
        key: 'Enter',
      })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['user-1'])
    })

    it('selects an option with Space', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      await wrapper.get('[role="option"]').trigger('keydown', {
        key: ' ',
      })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['user-1'])
    })

    it('moves to the next enabled option with ArrowDown', async () => {
      const wrapper = createWrapper()

      // Keyboard opening initializes Alice as the active option.
      await wrapper.get('.select-field__trigger').trigger('keydown', {
        key: 'ArrowDown',
      })

      await nextTick()

      expect(wrapper.get('[role="option"][tabindex="0"]').text()).toBe('Alice')

      await wrapper.get('[role="option"][tabindex="0"]').trigger('keydown', {
        key: 'ArrowDown',
      })

      await nextTick()

      expect(wrapper.get('[role="option"][tabindex="0"]').text()).toBe('Bob')
    })

    it('skips disabled options during keyboard navigation', async () => {
      const wrapper = createWrapper({ modelValue: 'user-2' })
      await wrapper.get('.select-field__trigger').trigger('click')

      const renderedOptions = wrapper.findAll('[role="option"]')

      await renderedOptions[1]!.trigger('keydown', {
        key: 'ArrowDown',
      })

      await nextTick()

      expect(renderedOptions[0]?.attributes('tabindex')).toBe('0')
      expect(renderedOptions[2]?.attributes('tabindex')).toBe('-1')
    })

    it('moves to the first enabled option with Home', async () => {
      const wrapper = createWrapper({ modelValue: 'user-2' })
      await wrapper.get('.select-field__trigger').trigger('click')

      const renderedOptions = wrapper.findAll('[role="option"]')

      await renderedOptions[1]!.trigger('keydown', {
        key: 'Home',
      })

      await nextTick()

      expect(renderedOptions[0]?.attributes('tabindex')).toBe('0')
    })

    it('moves to the last enabled option with End', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      const renderedOptions = wrapper.findAll('[role="option"]')

      await renderedOptions[0]!.trigger('keydown', {
        key: 'End',
      })

      await nextTick()

      expect(renderedOptions[1]?.attributes('tabindex')).toBe('0')
    })

    it('closes with Tab', async () => {
      const wrapper = createWrapper()
      await wrapper.get('.select-field__trigger').trigger('click')

      await wrapper.get('[role="option"]').trigger('keydown', {
        key: 'Tab',
      })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })
})
