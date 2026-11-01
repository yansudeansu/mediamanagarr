import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MmSettingsTemplate from './MmSettingsTemplate.vue'
import MmTabs from '../../molecules/MmTabs/MmTabs.vue'
import type { TabItem } from '../../molecules/MmTabs/MmTabs.vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmSelect from '../../atoms/MmSelect/MmSelect.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'

const settingsTabs: TabItem[] = [
  { id: 'connections', label: 'Connections' },
  { id: 'workspace', label: 'Workspace' },
]

const workspaceOptions = [
  { label: 'Popup', value: 'popup' },
  { label: 'Sidebar', value: 'sidebar' },
  { label: 'Detached window', value: 'detached' },
]

const meta = {
  title: 'Templates/Settings',
  component: MmSettingsTemplate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A generic Settings layout with a navigation slot and a default content slot. ' +
          'The parent owns navigation state, content, and settings behavior.',
      },
    },
  },
} satisfies Meta<typeof MmSettingsTemplate>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive example demonstrating how a parent composes
 * Settings navigation and content.
 *
 * All state is local to Storybook.
 */
export const Playground: Story = {
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmTabs,
      MmCard,
      MmSelect,
      MmButton,
    },

    setup() {
      const activeTab = ref('connections')
      const workspaceMode = ref('popup')

      return {
        activeTab,
        settingsTabs,
        workspaceMode,
        workspaceOptions,
      }
    },

    template: `
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <mm-tabs
              v-model="activeTab"
              :items="settingsTabs"
              label="Settings sections"
            />
          </template>

          <section
            v-if="activeTab === 'connections'"
            aria-labelledby="connections-title"
          >
            <mm-card>
              <h2 id="connections-title">Connections</h2>

              <p>
                Configure the services MediaManagarr connects to.
              </p>

              <mm-button variant="secondary" block>
                Add connection
              </mm-button>
            </mm-card>
          </section>

          <section
            v-else
            aria-labelledby="workspace-title"
          >
            <mm-card>
              <h2 id="workspace-title">Workspace</h2>

              <p>
                Choose how MediaManagarr opens from your browser toolbar.
              </p>

              <mm-select
                v-model="workspaceMode"
                label="Default workspace"
                :options="workspaceOptions"
              />
            </mm-card>
          </section>
        </mm-settings-template>
      </div>
    `,
  }),
}

/**
 * A Settings layout containing only navigation.
 */
export const NavigationOnly: Story = {
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmTabs,
    },

    setup() {
      const activeTab = ref('connections')

      return {
        activeTab,
        settingsTabs,
      }
    },

    template: `
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <mm-tabs
              v-model="activeTab"
              :items="settingsTabs"
              label="Settings sections"
            />
          </template>
        </mm-settings-template>
      </div>
    `,
  }),
}

/**
 * A Settings layout without navigation.
 */
export const ContentOnly: Story = {
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmCard,
    },

    template: `
      <div style="width: 360px">
        <mm-settings-template>
          <mm-card>
            <h2>General Settings</h2>

            <p>
              Settings content can be rendered without navigation.
            </p>
          </mm-card>
        </mm-settings-template>
      </div>
    `,
  }),
}

/**
 * Demonstrates that the template can render arbitrary content.
 */
export const CustomContent: Story = {
  render: () => ({
    components: {
      MmSettingsTemplate,
      MmCard,
    },

    template: `
      <div style="width: 360px">
        <mm-settings-template>
          <template #navigation>
            <nav aria-label="Example navigation">
              Custom navigation
            </nav>
          </template>

          <mm-card>
            <h2>Custom Settings</h2>

            <p>
              The template does not require a specific form,
              service selector, or settings component.
            </p>
          </mm-card>
        </mm-settings-template>
      </div>
    `,
  }),
}
