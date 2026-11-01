<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmInput from '../../atoms/MmInput/MmInput.vue'
import MmPanel from '../../atoms/MmPanel/MmPanel.vue'
import MmSelect from '../../atoms/MmSelect/MmSelect.vue'
import MmServiceHealth from '../../molecules/MmServiceHealth/MmServiceHealth.vue'
import { SERVICE_REGISTRY } from '../../../services/registry'
import type { ServiceHealth, ServiceId } from '../../../types/service'
import type { JellyfinUser } from '../../../types/jellyfin'
import { normalizeServerUrl } from '../../../utils/service-config'

interface Props {
  serviceId: ServiceId
  url?: string
  configured?: boolean
  loading?: boolean
  testing?: boolean
  removing?: boolean
  error?: string
  success?: string
  health?: ServiceHealth
  jellyfinUsers?: JellyfinUser[]
  jellyfinUserId?: string
  jellyfinUsersLoading?: boolean
  jellyfinUserSaving?: boolean
  jellyfinUsersError?: string
  jellyfinUserSuccess?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  configured: false,
  loading: false,
  testing: false,
  removing: false,
  error: '',
  success: '',
  health: undefined,
  jellyfinUsers: () => [],
  jellyfinUserId: '',
  jellyfinUsersLoading: false,
  jellyfinUserSaving: false,
  jellyfinUsersError: '',
  jellyfinUserSuccess: '',
})

const emit = defineEmits<{
  connect: [payload: { serviceId: ServiceId; url: string; apiKey: string }]
  testConnection: [serviceId: ServiceId]
  remove: [serviceId: ServiceId]
  selectJellyfinUser: [userId: string]
  edit: []
}>()

const service = computed(() => SERVICE_REGISTRY[props.serviceId])

const serverUrl = ref(props.url)
const apiKey = ref('')
const validationError = ref('')
const confirmingRemoval = ref(false)

const busy = computed(() => props.loading || props.testing || props.removing)

function getNormalizedUrl(value: string): string {
  try {
    return normalizeServerUrl(value)
  } catch {
    return ''
  }
}

const isSavedUrl = computed(() => {
  if (!props.configured) return false

  const savedUrl = getNormalizedUrl(props.url)
  const draftUrl = getNormalizedUrl(serverUrl.value)

  return savedUrl !== '' && draftUrl === savedUrl
})

const canTestSavedConnection = computed(() => isSavedUrl.value && apiKey.value.trim() === '')

const showJellyfinUserSelect = computed(() => props.serviceId === 'jellyfin' && isSavedUrl.value)

const showSuccess = computed(
  () => Boolean(props.success) && !validationError.value && !props.error && !busy.value,
)

const showJellyfinUserSuccess = computed(
  () =>
    showJellyfinUserSelect.value &&
    Boolean(props.jellyfinUserSuccess) &&
    !props.jellyfinUserSaving &&
    !props.jellyfinUsersLoading &&
    !props.jellyfinUsersError &&
    !busy.value,
)

const jellyfinUserOptions = computed(() =>
  props.jellyfinUsers.map((user) => ({
    label: user.name,
    value: user.id,
  })),
)

watch(
  () => [props.serviceId, props.url] as const,
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

function handleEdit() {
  validationError.value = ''
  confirmingRemoval.value = false
  emit('edit')
}

function handleConnect() {
  if (busy.value) return

  validationError.value = ''

  let url: string

  try {
    url = normalizeServerUrl(serverUrl.value)
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : 'Enter a valid server URL.'
    return
  }

  const key = apiKey.value.trim()
  const canReuseKey = isSavedUrl.value

  if (!key && !canReuseKey) {
    validationError.value = 'Enter an API key.'
    return
  }

  confirmingRemoval.value = false

  emit('connect', {
    serviceId: props.serviceId,
    url,
    apiKey: key,
  })
}

function handleTestConnection() {
  if (busy.value || !canTestSavedConnection.value) return

  validationError.value = ''
  confirmingRemoval.value = false

  emit('testConnection', props.serviceId)
}

function requestRemoval() {
  if (busy.value || !props.configured) return

  validationError.value = ''
  confirmingRemoval.value = true
}

function cancelRemoval() {
  if (busy.value) return

  confirmingRemoval.value = false
}

function confirmRemoval() {
  if (busy.value || !props.configured || !confirmingRemoval.value) return

  emit('remove', props.serviceId)
}
</script>

<template>
  <mm-panel class="service-form" :aria-label="`${service.name} configuration`">
    <div class="service-form__heading">
      <h2 class="service-form__title">{{ service.name }}</h2>
      <p class="service-form__description">{{ service.description }}</p>
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

      <div v-if="showJellyfinUserSelect" class="service-form__jellyfin-user">
        <mm-select
          :model-value="jellyfinUserId"
          label="Jellyfin User"
          :options="jellyfinUserOptions"
          placeholder="Select a Jellyfin user"
          :loading="jellyfinUsersLoading"
          :disabled="busy || jellyfinUserSaving || jellyfinUserOptions.length === 0"
          :error="jellyfinUsersError"
          hint="Choose the Jellyfin user whose library you want to view."
          @update:model-value="emit('selectJellyfinUser', $event)"
        />

        <p
          v-if="jellyfinUserSaving"
          class="service-form__user-feedback"
          role="status"
          aria-live="polite"
        >
          Saving Jellyfin user…
        </p>

        <p
          v-else-if="showJellyfinUserSuccess"
          class="service-form__success"
          role="status"
          aria-live="polite"
        >
          {{ jellyfinUserSuccess }}
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

      <mm-service-health v-if="configured" :health="health" />

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
          :aria-label="`Remove ${service.name} server confirmation`"
        >
          <h3 class="service-form__confirmation-title">Remove {{ service.name }} server?</h3>

          <p class="service-form__confirmation-description">
            This removes the saved server connection and API key from MediaManagarr. Your actual
            server and media library won't be affected.
            <template v-if="serviceId === 'jellyfin'">
              Your selected Jellyfin user will also be cleared.
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

.service-form__jellyfin-user {
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
