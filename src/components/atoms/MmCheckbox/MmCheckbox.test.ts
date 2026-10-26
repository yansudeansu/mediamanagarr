import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmCheckbox from './MmCheckbox.vue'

describe('MmCheckbox', () => {
  it('renders a native checkbox', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
      },
    })

    expect(wrapper.get('input').attributes('type')).toBe('checkbox')
  })

  it('renders the label', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
      },
    })

    expect(wrapper.get('label').text()).toBe('Delete downloaded files')
  })

  it('associates the label with the checkbox', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
      },
    })

    const input = wrapper.get('input')
    const label = wrapper.get('label')

    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('is unchecked by default', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
      },
    })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(false)
  })

  it('supports a checked model value', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        modelValue: true,
      },
    })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('emits true when checked', async () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
      },
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits false when unchecked', async () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        modelValue: true,
      },
    })

    await wrapper.get('input').setValue(false)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('updates when the model value changes', async () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        modelValue: false,
      },
    })

    await wrapper.setProps({
      modelValue: true,
    })

    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('supports the disabled state', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        disabled: true,
      },
    })

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('checkbox-field--disabled')
  })

  it('supports the required state', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Accept terms',
        required: true,
      },
    })

    expect(wrapper.get('input').attributes('required')).toBeDefined()
    expect(wrapper.find('.checkbox-field__required').exists()).toBe(true)
  })

  it('supports a name attribute', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Enable notifications',
        name: 'notifications',
      },
    })

    expect(wrapper.get('input').attributes('name')).toBe('notifications')
  })

  it('renders an accessible hint', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
        hint: 'This will permanently delete the downloaded data.',
      },
    })

    const input = wrapper.get('input')
    const hint = wrapper.get('.checkbox-field__hint')

    expect(hint.text()).toBe('This will permanently delete the downloaded data.')
    expect(input.attributes('aria-describedby')).toBe(hint.attributes('id'))
  })

  it('does not add aria-describedby without a hint', () => {
    const wrapper = mount(MmCheckbox, {
      props: {
        label: 'Delete downloaded files',
      },
    })

    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined()
  })

  it('generates unique IDs for multiple instances', () => {
    const wrapper = mount({
      components: { MmCheckbox },
      template: `
        <div>
          <mm-checkbox label="First option" />
          <mm-checkbox label="Second option" />
        </div>
      `,
    })

    const inputs = wrapper.findAll('input')

    expect(inputs).toHaveLength(2)
    expect(inputs[0].attributes('id')).not.toBe(inputs[1].attributes('id'))
  })
})
