import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmCheckbox from './MmCheckbox.vue'
import { mmCheckboxSelectors } from '../../../test/selectors/atoms/mmCheckbox.selectors'

let wrapper: VueWrapper

const checkbox = mmCheckboxSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector)
})

describe('MmCheckbox', () => {
  it('renders a native checkbox', () => {
    wrapper = mount(MmCheckbox, {
      props: { label: 'Delete downloaded files' },
    })

    expect(checkbox.control().attributes('type')).toBe('checkbox')
  })

  it('renders the label', () => {
    wrapper = mount(MmCheckbox, {
      props: { label: 'Delete downloaded files' },
    })

    expect(checkbox.label().text()).toBe('Delete downloaded files')
  })

  it('associates the label with the checkbox', () => {
    wrapper = mount(MmCheckbox, {
      props: { label: 'Delete downloaded files' },
    })

    const input = checkbox.control()
    const label = checkbox.label()

    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('is unchecked by default', () => {
    wrapper = mount(MmCheckbox, {
      props: { label: 'Delete downloaded files' },
    })

    expect(checkbox.unchecked().exists()).toBe(true)
  })

  it('supports a checked model value', () => {
    wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        modelValue: true,
      },
    })

    expect(checkbox.checked().exists()).toBe(true)
  })

  it('emits true when checked', async () => {
    wrapper = mount(MmCheckbox, {
      props: { label: 'Delete downloaded files' },
    })

    await checkbox.control().setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits false when unchecked', async () => {
    wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        modelValue: true,
      },
    })

    await checkbox.control().setValue(false)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('updates when the model value changes', async () => {
    wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        modelValue: false,
      },
    })

    await wrapper.setProps({ modelValue: true })

    expect(checkbox.checked().exists()).toBe(true)
  })

  it('supports the disabled state', () => {
    wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        disabled: true,
      },
    })

    expect(checkbox.disabled().exists()).toBe(true)
    expect(checkbox.get().classes()).toContain('checkbox-field--disabled')
  })

  it('supports the required state', () => {
    wrapper = mount(MmCheckbox, {
      props: {
        label: 'Accept terms',
        required: true,
      },
    })

    expect(checkbox.required().exists()).toBe(true)
    expect(checkbox.requiredIndicator().exists()).toBe(true)
  })

  it('supports a name attribute', () => {
    wrapper = mount(MmCheckbox, {
      props: {
        label: 'Enable notifications',
        name: 'notifications',
      },
    })

    expect(checkbox.control().attributes('name')).toBe('notifications')
  })

  it('renders an accessible hint', () => {
    wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        hint: 'This will permanently delete the downloaded data.',
      },
    })

    const input = checkbox.control()
    const hint = checkbox.hint()

    expect(hint.text()).toBe('This will permanently delete the downloaded data.')
    expect(input.attributes('aria-describedby')).toBe(hint.attributes('id'))
  })

  it('does not add aria-describedby without a hint', () => {
    wrapper = mount(MmCheckbox, {
      props: { label: 'Delete downloaded files' },
    })

    expect(checkbox.control().attributes('aria-describedby')).toBeUndefined()
    expect(checkbox.hint().exists()).toBe(false)
  })

  it('generates unique IDs for multiple instances', () => {
    wrapper = mount({
      components: { MmCheckbox },
      template: `
        <div>
          <mm-checkbox label="First option" />
          <mm-checkbox label="Second option" />
        </div>
      `,
    })

    const inputs = wrapper.findAll('.checkbox-field__control')

    expect(inputs).toHaveLength(2)
    expect(inputs[0].attributes('id')).not.toBe(inputs[1].attributes('id'))
  })
})
