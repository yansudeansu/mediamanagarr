import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmInput from './MmInput.vue'
import { mmInputSelectors } from '../../../test/selectors/atoms/mmInput.selectors'

let wrapper: VueWrapper

const input = mmInputSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.input-field /, ''))
})

describe('MmInput', () => {
  it('renders its label', () => {
    wrapper = mount(MmInput, {
      props: { label: 'Server URL' },
    })

    expect(input.label().text()).toBe('Server URL')
  })

  it('associates its label with the input', () => {
    wrapper = mount(MmInput, {
      props: { label: 'Server URL' },
    })

    expect(input.label().attributes('for')).toBe(input.control().attributes('id'))
  })

  it('uses text input by default', () => {
    wrapper = mount(MmInput, {
      props: { label: 'Name' },
    })

    expect(input.type('text').exists()).toBe(true)
  })

  it('supports URL inputs', () => {
    wrapper = mount(MmInput, {
      props: { label: 'Server URL', type: 'url' },
    })

    expect(input.type('url').exists()).toBe(true)
  })

  it('supports password inputs', () => {
    wrapper = mount(MmInput, {
      props: { label: 'API Key', type: 'password' },
    })

    expect(input.type('password').exists()).toBe(true)
  })

  it('displays the model value', () => {
    wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        modelValue: 'https://jellyfin.example.com',
      },
    })

    expect((input.control().element as HTMLInputElement).value).toBe('https://jellyfin.example.com')
  })

  it('emits an update when the user types', async () => {
    wrapper = mount(MmInput, {
      props: { label: 'Server URL' },
    })

    await input.control().setValue('https://jellyfin.example.com')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['https://jellyfin.example.com'])
  })

  it('reacts when its model value changes', async () => {
    wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        modelValue: 'https://old.example.com',
      },
    })

    await wrapper.setProps({ modelValue: 'https://new.example.com' })

    expect((input.control().element as HTMLInputElement).value).toBe('https://new.example.com')
  })

  it('supports placeholders', () => {
    wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        placeholder: 'https://example.com',
      },
    })

    expect(input.control().attributes('placeholder')).toBe('https://example.com')
  })

  it('supports required fields', () => {
    wrapper = mount(MmInput, {
      props: { label: 'Server URL', required: true },
    })

    expect(input.required().exists()).toBe(true)
    expect(input.requiredIndicator().exists()).toBe(true)
  })

  it('supports disabled fields', () => {
    wrapper = mount(MmInput, {
      props: { label: 'Server URL', disabled: true },
    })

    expect(input.disabled().exists()).toBe(true)
  })

  it('displays a hint associated with the input', () => {
    wrapper = mount(MmInput, {
      props: {
        label: 'API Key',
        hint: 'Leave blank to reuse the saved API key.',
      },
    })

    const hint = input.hint()

    expect(hint.text()).toBe('Leave blank to reuse the saved API key.')
    expect(input.control().attributes('aria-describedby')).toBe(hint.attributes('id'))
  })

  it('displays an error associated with the input', () => {
    wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        error: 'Enter a valid server URL.',
      },
    })

    const error = input.error()

    expect(error.text()).toBe('Enter a valid server URL.')
    expect(error.attributes('role')).toBe('alert')
    expect(input.invalid().exists()).toBe(true)
    expect(input.control().attributes('aria-describedby')).toBe(error.attributes('id'))
  })

  it('associates both hint and error with the input', () => {
    wrapper = mount(MmInput, {
      props: {
        label: 'Server URL',
        hint: 'HTTPS only.',
        error: 'Invalid URL.',
      },
    })

    const describedBy = input.control().attributes('aria-describedby')

    expect(describedBy).toContain(input.hint().attributes('id'))
    expect(describedBy).toContain(input.error().attributes('id'))
  })

  it('does not mark valid inputs as invalid', () => {
    wrapper = mount(MmInput, {
      props: { label: 'Server URL' },
    })

    expect(input.valid().exists()).toBe(true)
    expect(input.control().attributes('aria-invalid')).toBeUndefined()
  })

  it('supports custom names and autocomplete values', () => {
    wrapper = mount(MmInput, {
      props: {
        label: 'API Key',
        name: 'apiKey',
        autocomplete: 'off',
      },
    })

    expect(input.control().attributes('name')).toBe('apiKey')
    expect(input.control().attributes('autocomplete')).toBe('off')
  })

  it('generates unique IDs for multiple inputs in the same application', () => {
    wrapper = mount({
      components: { MmInput },
      template: `
        <div>
          <MmInput label="Server URL" />
          <MmInput label="API Key" type="password" />
        </div>
      `,
    })

    const inputs = wrapper.findAll('.input-field__control')

    expect(inputs).toHaveLength(2)

    const firstId = inputs[0]?.attributes('id')
    const secondId = inputs[1]?.attributes('id')

    expect(firstId).toBeDefined()
    expect(secondId).toBeDefined()
    expect(firstId).not.toBe(secondId)
  })
})
