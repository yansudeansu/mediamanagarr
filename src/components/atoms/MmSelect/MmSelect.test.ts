import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmSelect from './MmSelect.vue'
import { mmSelectSelectors } from '../../../test/selectors/atoms/mmSelect.selectors'

const options = [
  { label: 'Alice', value: 'user-1' },
  { label: 'Bob', value: 'user-2' },
  { label: 'Charlie', value: 'user-3', disabled: true },
]

let wrapper: VueWrapper

const select = mmSelectSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.select-field /, ''))
})

function createWrapper(props: Partial<InstanceType<typeof MmSelect>['$props']> = {}) {
  wrapper = mount(MmSelect, {
    props: {
      label: 'Jellyfin user',
      options,
      ...props,
    },
  })
  return wrapper
}

describe('MmSelect', () => {
  describe('rendering', () => {
    it('renders its label', () => {
      createWrapper()

      expect(select.label().text()).toBe('Jellyfin user')
    })

    it('associates its label and visible value with the trigger', () => {
      createWrapper({ modelValue: 'user-1' })

      const label = select.label()
      const value = select.value()
      const trigger = select.trigger()

      expect(trigger.attributes('aria-labelledby')).toBe(
        `${label.attributes('id')} ${value.attributes('id')}`,
      )
      expect(value.text()).toBe('Alice')
    })

    it('renders the placeholder when nothing is selected', () => {
      createWrapper({ placeholder: 'Select a user' })

      expect(select.value().text()).toBe('Select a user')
    })

    it('renders the fallback placeholder when none is provided', () => {
      createWrapper()

      expect(select.value().text()).toBe('Select an option')
    })

    it('displays the selected option label', () => {
      createWrapper({ modelValue: 'user-2' })

      expect(select.value().text()).toBe('Bob')
    })

    it('renders all options when opened', async () => {
      createWrapper()

      await select.trigger().trigger('click')

      const renderedOptions = select.dropdown().findAll('[role="option"]')

      expect(renderedOptions).toHaveLength(3)
      expect(renderedOptions.map((option) => option.text())).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('does not render the dropdown while closed', () => {
      createWrapper()

      expect(select.dropdown().exists()).toBe(false)
    })

    it('does not open the dropdown when no options are available', async () => {
      createWrapper({ options: [] })

      await select.trigger().trigger('click')

      expect(select.dropdown().exists()).toBe(false)
      expect(select.closed().exists()).toBe(true)
      expect(select.value().text()).toBe('Select an option')
    })

    it('reacts when its model value changes', async () => {
      createWrapper({ modelValue: 'user-1' })

      expect(select.value().text()).toBe('Alice')

      await wrapper.setProps({ modelValue: 'user-2' })

      expect(select.value().text()).toBe('Bob')
    })

    it('reacts when its options change', async () => {
      createWrapper()

      await wrapper.setProps({
        options: [{ label: 'Diana', value: 'user-4' }],
      })

      await select.trigger().trigger('click')

      const renderedOptions = select.dropdown().findAll('[role="option"]')

      expect(renderedOptions).toHaveLength(1)
      expect(renderedOptions[0]?.text()).toBe('Diana')
    })
  })

  describe('selection', () => {
    it('opens the dropdown when clicked', async () => {
      createWrapper()

      await select.trigger().trigger('click')

      expect(select.dropdown().exists()).toBe(true)
      expect(select.opened().exists()).toBe(true)
    })

    it('closes the dropdown when clicked again', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.trigger().trigger('click')

      expect(select.dropdown().exists()).toBe(false)
      expect(select.closed().exists()).toBe(true)
    })

    it('emits an update when an option is selected', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.option(1).trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['user-2'])
    })

    it('closes the dropdown after selecting an option', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.option(0).trigger('click')

      expect(select.dropdown().exists()).toBe(false)
    })

    it('marks the selected option', async () => {
      createWrapper({ modelValue: 'user-2' })

      await select.trigger().trigger('click')

      expect(select.option(0).attributes('aria-selected')).toBe('false')
      expect(select.option(1).attributes('aria-selected')).toBe('true')
      expect(select.option(2).attributes('aria-selected')).toBe('false')
    })

    it('does not emit an update when opening the dropdown', async () => {
      createWrapper()

      await select.trigger().trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('disabled and loading states', () => {
    it('supports disabled options', async () => {
      createWrapper()

      await select.trigger().trigger('click')

      const disabledOption = select.option(2)

      expect(disabledOption.attributes('disabled')).toBeDefined()
      expect(disabledOption.attributes('aria-disabled')).toBe('true')
    })

    it('supports disabled fields', () => {
      createWrapper({ disabled: true })

      expect(select.disabled().exists()).toBe(true)
    })

    it('does not open when disabled', async () => {
      createWrapper({ disabled: true })

      await select.trigger().trigger('click')

      expect(select.dropdown().exists()).toBe(false)
    })

    it('disables the dropdown while loading', () => {
      createWrapper({ loading: true })

      expect(select.disabled().exists()).toBe(true)
      expect(select.loading().exists()).toBe(true)
      expect(select.value().text()).toBe('Loading...')
    })

    it('does not mark the trigger as busy by default', () => {
      createWrapper()

      expect(select.trigger().attributes('aria-busy')).toBeUndefined()
    })

    it('closes an open dropdown when disabled', async () => {
      createWrapper()

      await select.trigger().trigger('click')

      expect(select.dropdown().exists()).toBe(true)

      await wrapper.setProps({ disabled: true })

      expect(select.dropdown().exists()).toBe(false)
    })
  })

  describe('validation and accessibility', () => {
    it('supports required fields', () => {
      createWrapper({ required: true })

      expect(select.requiredIndicator().text()).toBe('*')
    })

    it('does not show a required indicator by default', () => {
      createWrapper()

      expect(select.requiredIndicator().exists()).toBe(false)
    })

    it('displays a hint associated with the trigger', () => {
      createWrapper({
        hint: 'Watched media will be hidden for this user.',
      })

      const hint = select.hint()
      const trigger = select.trigger()

      expect(hint.text()).toBe('Watched media will be hidden for this user.')
      expect(trigger.attributes('aria-describedby')).toContain(hint.attributes('id'))
    })

    it('displays an error associated with the trigger', () => {
      createWrapper({
        error: 'Could not load Jellyfin users.',
      })

      const error = select.error()
      const trigger = select.trigger()

      expect(error.text()).toBe('Could not load Jellyfin users.')
      expect(error.attributes('role')).toBe('alert')
      expect(select.invalid().exists()).toBe(true)
      expect(trigger.attributes('aria-describedby')).toContain(error.attributes('id'))
    })

    it('associates both hint and error with the trigger', () => {
      createWrapper({
        hint: 'Choose your Jellyfin account.',
        error: 'Selection is required.',
      })

      const describedBy = select.trigger().attributes('aria-describedby')

      expect(describedBy).toContain(select.hint().attributes('id'))
      expect(describedBy).toContain(select.error().attributes('id'))
    })

    it('does not mark valid selects as invalid', () => {
      createWrapper()

      expect(select.trigger().attributes('aria-invalid')).toBeUndefined()
    })

    it('supports the name attribute through a hidden input', () => {
      createWrapper({
        name: 'jellyfinUser',
        modelValue: 'user-2',
      })

      const input = select.hiddenInput()

      expect(input.attributes('name')).toBe('jellyfinUser')
      expect(input.attributes('value')).toBe('user-2')
    })

    it('does not render a hidden input without a name', () => {
      createWrapper()

      expect(select.hiddenInput().exists()).toBe(false)
    })

    it('generates unique IDs within the same application', () => {
      wrapper = mount({
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
      wrapper = mount(MmSelect, {
        props: {
          label: 'Jellyfin user',
          options,
        },
        attrs: {
          'aria-label': 'Select Jellyfin account',
        },
      })

      expect(select.trigger().attributes('aria-label')).toBe('Select Jellyfin account')
    })

    it('does not reference a missing listbox while closed', () => {
      createWrapper()

      const trigger = select.trigger()

      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(trigger.attributes('aria-controls')).toBeUndefined()
      expect(select.dropdown().exists()).toBe(false)
    })

    it('exposes the listbox relationship while open', async () => {
      createWrapper()

      await select.trigger().trigger('click')

      const trigger = select.trigger()
      const listbox = select.dropdown()

      expect(trigger.attributes('aria-haspopup')).toBe('listbox')
      expect(trigger.attributes('aria-controls')).toBe(listbox.attributes('id'))
    })

    it('removes the listbox reference after closing', async () => {
      createWrapper()

      await select.trigger().trigger('click')

      expect(select.trigger().attributes('aria-controls')).toBeDefined()

      await select.trigger().trigger('click')

      expect(select.trigger().attributes('aria-controls')).toBeUndefined()
      expect(select.dropdown().exists()).toBe(false)
    })
  })

  describe('keyboard navigation', () => {
    it('opens with ArrowDown', async () => {
      createWrapper()

      await select.trigger().trigger('keydown', { key: 'ArrowDown' })

      expect(select.dropdown().exists()).toBe(true)
    })

    it('opens with ArrowUp', async () => {
      createWrapper()

      await select.trigger().trigger('keydown', { key: 'ArrowUp' })

      expect(select.dropdown().exists()).toBe(true)
    })

    it('closes with Escape', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.option(0).trigger('keydown', { key: 'Escape' })

      expect(select.dropdown().exists()).toBe(false)
    })

    it('selects an option with Enter', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.option(0).trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['user-1'])
    })

    it('selects an option with Space', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.option(0).trigger('keydown', { key: ' ' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['user-1'])
    })

    it('moves to the next enabled option with ArrowDown', async () => {
      createWrapper()

      await select.trigger().trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(select.active().text()).toBe('Alice')

      await select.active().trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(select.active().text()).toBe('Bob')
    })

    it('skips disabled options during keyboard navigation', async () => {
      createWrapper({ modelValue: 'user-2' })

      await select.trigger().trigger('click')
      await select.option(1).trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(select.option(0).attributes('tabindex')).toBe('0')
      expect(select.option(2).attributes('tabindex')).toBe('-1')
    })

    it('moves to the first enabled option with Home', async () => {
      createWrapper({ modelValue: 'user-2' })

      await select.trigger().trigger('click')
      await select.option(1).trigger('keydown', { key: 'Home' })
      await nextTick()

      expect(select.option(0).attributes('tabindex')).toBe('0')
    })

    it('moves to the last enabled option with End', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.option(0).trigger('keydown', { key: 'End' })
      await nextTick()

      expect(select.option(1).attributes('tabindex')).toBe('0')
    })

    it('closes with Tab', async () => {
      createWrapper()

      await select.trigger().trigger('click')
      await select.option(0).trigger('keydown', { key: 'Tab' })

      expect(select.dropdown().exists()).toBe(false)
    })
  })
})
