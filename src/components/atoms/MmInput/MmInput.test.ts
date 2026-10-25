import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmInput from './MmInput.vue'

describe('MmInput', () => {
  it('renders its label', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
      },
    })

    expect(wrapper.get('label').text()).toBe('Server URL')
  })

  it('associates its label with the input', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
      },
    })

    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'))
  })

  it('uses text input by default', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Name',
      },
    })

    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('supports URL inputs', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        type: 'url',
      },
    })

    expect(wrapper.get('input').attributes('type')).toBe('url')
  })

  it('supports password inputs', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'API Key',
        type: 'password',
      },
    })

    expect(wrapper.get('input').attributes('type')).toBe('password')
  })

  it('displays the model value', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        modelValue: 'https://jellyfin.example.com',
      },
    })

    expect(wrapper.get('input').element.value).toBe('https://jellyfin.example.com')
  })

  it('emits an update when the user types', async () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
      },
    })

    await wrapper.get('input').setValue('https://jellyfin.example.com')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['https://jellyfin.example.com'])
  })

  it('reacts when its model value changes', async () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        modelValue: 'https://old.example.com',
      },
    })

    await wrapper.setProps({
      modelValue: 'https://new.example.com',
    })

    expect(wrapper.get('input').element.value).toBe('https://new.example.com')
  })

  it('supports placeholders', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        placeholder: 'https://example.com',
      },
    })

    expect(wrapper.get('input').attributes('placeholder')).toBe('https://example.com')
  })

  it('supports required fields', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        required: true,
      },
    })

    expect(wrapper.get('input').attributes('required')).toBeDefined()
    expect(wrapper.find('.input-field__required').exists()).toBe(true)
  })

  it('supports disabled fields', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        disabled: true,
      },
    })

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('displays a hint associated with the input', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'API Key',
        hint: 'Leave blank to reuse the saved API key.',
      },
    })

    const hint = wrapper.get('.input-field__hint')

    expect(hint.text()).toBe('Leave blank to reuse the saved API key.')
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(hint.attributes('id'))
  })

  it('displays an error associated with the input', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        error: 'Enter a valid server URL.',
      },
    })

    const error = wrapper.get('.input-field__error')

    expect(error.text()).toBe('Enter a valid server URL.')
    expect(error.attributes('role')).toBe('alert')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(error.attributes('id'))
  })

  it('associates both hint and error with the input', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        hint: 'HTTPS only.',
        error: 'Invalid URL.',
      },
    })

    const describedBy = wrapper.get('input').attributes('aria-describedby')

    expect(describedBy).toContain(wrapper.get('.input-field__hint').attributes('id'))
    expect(describedBy).toContain(wrapper.get('.input-field__error').attributes('id'))
  })

  it('does not mark valid inputs as invalid', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
      },
    })

    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('supports custom names and autocomplete values', () => {
    const wrapper = mount(MmInput, {
      props: {
        label: 'API Key',
        name: 'apiKey',
        autocomplete: 'off',
      },
    })

    expect(wrapper.get('input').attributes('name')).toBe('apiKey')
    expect(wrapper.get('input').attributes('autocomplete')).toBe('off')
  })

  it('generates unique IDs for multiple inputs in the same application', () => {
    const wrapper = mount({
      components: { MmInput },
      template: `
      <div>
        <MmInput label="Server URL" />
        <MmInput label="API Key" type="password" />
      </div>
    `,
    })

    const inputs = wrapper.findAll('input')

    expect(inputs).toHaveLength(2)

    const firstId = inputs[0]?.attributes('id')
    const secondId = inputs[1]?.attributes('id')

    expect(firstId).toBeDefined()
    expect(secondId).toBeDefined()
    expect(firstId).not.toBe(secondId)
  })
})
