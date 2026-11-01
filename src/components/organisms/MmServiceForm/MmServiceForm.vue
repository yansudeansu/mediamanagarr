<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmInput from '../../atoms/MmInput/MmInput.vue'
import MmPanel from '../../atoms/MmPanel/MmPanel.vue'
import MmSelect from '../../atoms/MmSelect/MmSelect.vue'
import MmServiceHealth from '../../molecules/MmServiceHealth/MmServiceHealth.vue'

interface UserOption {
  label: string
  value: string
}

interface Props {
  name: string
  description?: string
  url?: string
  configured?: boolean
  loading?: boolean
  testing?: boolean
  removing?: boolean
  error?: string
  success?: string
  healthStatus?: 'connected' | 'failed' | 'not-checked'
  healthLastCheckedLabel?: string
  healthError?: string
  canReuseSavedKey?: boolean
  userSelectionLabel?: string
  userSelectionHint?: string
  userOptions?: UserOption[]
  selectedUserId?: string
  usersLoading?: boolean
  userSaving?: boolean
  usersError?: string
  userSuccess?: string
  removalNote?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  url: '',
  configured: false,
  loading: false,
  testing: false,
  removing: false,
  error: '',
  success: '',
  healthStatus: 'not-checked',
  healthLastCheckedLabel: '',
  healthError: '',
  canReuseSavedKey: false,
  userSelectionLabel: '',
  userSelectionHint: '',
  userOptions: () => [],
  selectedUserId: '',
  usersLoading: false,
  userSaving: false,
  usersError: '',
  userSuccess: '',
  removalNote: '',
})

const emit = defineEmits<{
  connect: [payload: { url: string; apiKey: string }]
  testConnection: []
  remove: []
  selectUser: [userId: string]
  edit: []
}>()

const serverUrl = ref(props.url)
const apiKey = ref('')
const validationError = ref('')
const confirmingRemoval = ref(false)

const busy = computed(() => props.loading || props.testing || props.removing)

const isSavedUrl = computed(() => props.configured && serverUrl.value.trim() === props.url.trim())

const canReuseKey = computed(() => props.canReuseSavedKey && isSavedUrl.value)

// A configured service without a saved URL cannot be tested.
// The draft must also match the saved URL, with no new API key entered.
const canTestSavedConnection = computed(
  () => isSavedUrl.value && Boolean(props.url.trim()) && apiKey.value.trim() === '',
)

const showUserSelect = computed(() => Boolean(props.userSelectionLabel) && isSavedUrl.value)

const showSuccess = computed(
  () => Boolean(props.success) && !validationError.value && !props.error && !busy.value,
)

const showUserSuccess = computed(
  () =>
    showUserSelect.value &&
    Boolean(props.userSuccess) &&
    !props.userSaving &&
    !props.usersLoading &&
    !props.usersError &&
    !busy.value,
)

watch(
  () => [props.name, props.url] as const,
  () => {
    serverUrl.value = props.url
    apiKey.value = ''
    validationError.value = ''
    confirmingRemoval.value = false
  },
)

watch(
  () => props.configured,
  (configured) => {
    if (!configured) {
      confirmingRemoval.value = false
    }
  },
)

function handleEdit(): void {
  validationError.value = ''
  confirmingRemoval.value = false
  emit('edit')
}

function handleConnect(): void {
  if (busy.value) return

  validationError.value = ''

  const url = serverUrl.value.trim()
  const key = apiKey.value.trim()

  if (!url) {
    validationError.value = 'Enter a server URL.'
    return
  }

  if (!key && !canReuseKey.value) {
    validationError.value = 'Enter an API key.'
    return
  }

  confirmingRemoval.value = false

  emit('connect', {
    url,
    apiKey: key,
  })
}

function handleTestConnection(): void {
  if (busy.value || !canTestSavedConnection.value) return

  validationError.value = ''
  confirmingRemoval.value = false

  emit('testConnection')
}

function requestRemoval(): void {
  if (busy.value || !props.configured) return

  validationError.value = ''
  confirmingRemoval.value = true
}

function cancelRemoval(): void {
  if (busy.value) return

  confirmingRemoval.value = false
}

function confirmRemoval(): void {
  if (busy.value || !props.configured || !confirmingRemoval.value) {
    return
  }

  emit('remove')
}
</script>

<template>
  <mm-panel class="service-form" :aria-label="`${name} configuration`">
    <div class="service-form__heading">
      <h2 class="service-form__title">
        {{ name }}
      </h2>

      <p class="service-form__description">
        {{ description }}
      </p>
    </div>

    <form class="service-form__fields" @submit.prevent="handleConnect">
      <mm-input
        v-model="serverUrl"
        label="Server URL"
        type="url"
        placeholder="http://localhost:8096"
        :disabled="busy"
        required
        @update:model-value="handleEdit"
      />

      <mm-input
        v-model="apiKey"
        label="API Key"
        type="password"
        :placeholder="configured ? 'Leave blank to keep saved key' : 'Enter API key'"
        :hint="configured ? 'Leave blank to reuse your saved API key.' : undefined"
        :disabled="busy"
        @update:model-value="handleEdit"
      />

      <div v-if="showUserSelect" class="service-form__user-selection">
        <mm-select
          :model-value="selectedUserId"
          :label="userSelectionLabel"
          :options="userOptions"
          placeholder="Select a user"
          :loading="usersLoading"
          :disabled="busy || userSaving || userOptions.length === 0"
          :error="usersError"
          :hint="userSelectionHint"
          @update:model-value="emit('selectUser', $event)"
        />

        <p v-if="userSaving" class="service-form__user-feedback" role="status" aria-live="polite">
          Saving user…
        </p>

        <p
          v-else-if="showUserSuccess"
          class="service-form__success"
          role="status"
          aria-live="polite"
        >
          {{ userSuccess }}
        </p>
      </div>

      <p v-if="validationError || error" class="service-form__error" role="alert">
        {{ validationError || error }}
      </p>

      <p v-if="showSuccess" class="service-form__success" role="status" aria-live="polite">
        {{ success }}
      </p>

      <mm-button type="submit" variant="primary" block :loading="loading" :disabled="busy">
        Connect &amp; Test
      </mm-button>

      <mm-service-health
        v-if="configured"
        :status="healthStatus"
        :last-checked-label="healthLastCheckedLabel"
        :error="healthError"
      />

      <mm-button
        v-if="configured"
        type="button"
        variant="secondary"
        block
        :loading="testing"
        :disabled="busy || !canTestSavedConnection"
        @click="handleTestConnection"
      >
        Test Connection
      </mm-button>

      <template v-if="configured">
        <div
          v-if="confirmingRemoval"
          class="service-form__confirmation"
          role="group"
          :aria-label="`Remove ${name} server confirmation`"
        >
          <h3 class="service-form__confirmation-title">Remove {{ name }} server?</h3>

          <p class="service-form__confirmation-description">
            This removes the saved server connection and API key from MediaManagarr. Your actual
            server and media library won't be affected.

            <template v-if="removalNote">
              {{ removalNote }}
            </template>
          </p>

          <div class="service-form__confirmation-actions">
            <mm-button type="button" variant="secondary" :disabled="busy" @click="cancelRemoval">
              Cancel
            </mm-button>

            <mm-button
              type="button"
              variant="danger"
              :loading="removing"
              :disabled="busy"
              @click="confirmRemoval"
            >
              Confirm removal
            </mm-button>
          </div>
        </div>

        <mm-button
          v-else
          type="button"
          variant="danger"
          block
          :disabled="busy"
          @click="requestRemoval"
        >
          Remove server
        </mm-button>
      </template>
    </form>
  </mm-panel>
</template>

<style scoped>
.service-form__heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.service-form__title {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.service-form__description {
  margin: 0;
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.service-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.service-form__user-selection {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.service-form__error,
.service-form__success,
.service-form__user-feedback {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.service-form__error {
  color: var(--danger);
}

.service-form__success {
  color: var(--status-success);
}

.service-form__user-feedback {
  color: var(--muted);
}

.service-form__confirmation {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--danger);
  border-radius: var(--radius-md);
}

.service-form__confirmation-title {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.service-form__confirmation-description {
  margin: 0;
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.service-form__confirmation-actions {
  display: flex;
  gap: var(--space-2);
}

.service-form__confirmation-actions > * {
  flex: 1;
}
</style>
