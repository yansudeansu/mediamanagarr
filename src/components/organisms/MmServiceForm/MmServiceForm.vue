<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmInput from '../../atoms/MmInput/MmInput.vue'
import MmSelect from '../../atoms/MmSelect/MmSelect.vue'
import { SERVICE_INFO, type ServiceId } from '../../../types/service'
import type { JellyfinUser } from '../../../types/jellyfin'
import { normalizeServerUrl } from '../../../utils/service-config'

interface Props {
  serviceId: ServiceId
  url?: string
  configured?: boolean
  loading?: boolean
  error?: string
  jellyfinUsers?: JellyfinUser[]
  jellyfinUserId?: string
  jellyfinUsersLoading?: boolean
  jellyfinUserSaving?: boolean
  jellyfinUsersError?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  configured: false,
  loading: false,
  error: '',
  jellyfinUsers: () => [],
  jellyfinUserId: '',
  jellyfinUsersLoading: false,
  jellyfinUserSaving: false,
  jellyfinUsersError: '',
})

const emit = defineEmits<{
  connect: [payload: { serviceId: ServiceId; url: string; apiKey: string }]
  selectJellyfinUser: [userId: string]
}>()

const service = computed(() => SERVICE_INFO[props.serviceId])
const serverUrl = ref(props.url)
const apiKey = ref('')
const validationError = ref('')

const showJellyfinUserSelect = computed(() => props.serviceId === 'jellyfin' && props.configured)

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
  },
)

function handleConnect() {
  validationError.value = ''

  let url: string

  try {
    url = normalizeServerUrl(serverUrl.value)
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : 'Enter a valid server URL.'
    return
  }

  const key = apiKey.value.trim()
  const savedUrl = props.url ? normalizeServerUrl(props.url) : ''
  const canReuseKey = props.configured && url === savedUrl

  if (!key && !canReuseKey) {
    validationError.value = 'Enter an API key.'
    return
  }

  emit('connect', {
    serviceId: props.serviceId,
    url,
    apiKey: key,
  })
}
</script>

<template>
  <section class="service-form" :aria-label="`${service.name} configuration`">
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
        :disabled="loading"
        required
      />

      <mm-input
        v-model="apiKey"
        label="API Key"
        type="password"
        :placeholder="configured ? 'Leave blank to keep saved key' : 'Enter API key'"
        :hint="configured ? 'Leave blank to reuse your saved API key.' : undefined"
        :disabled="loading"
      />

      <div v-if="showJellyfinUserSelect" class="service-form__jellyfin-user">
        <mm-select
          :model-value="jellyfinUserId"
          label="Jellyfin User"
          :options="jellyfinUserOptions"
          placeholder="Select a Jellyfin user"
          :loading="jellyfinUsersLoading"
          :disabled="loading || jellyfinUserSaving || jellyfinUserOptions.length === 0"
          :error="jellyfinUsersError"
          hint="Choose the Jellyfin user whose library you want to view."
          @update:model-value="emit('selectJellyfinUser', $event)"
        />
      </div>

      <p v-if="validationError || error" class="service-form__error" role="alert">
        {{ validationError || error }}
      </p>

      <mm-button type="submit" variant="primary" block :loading="loading" :disabled="loading">
        Connect &amp; Test
      </mm-button>
    </form>
  </section>
</template>

<style scoped>
.service-form {
  display: flex;
  flex-direction: column;
  gap: 18px;

  padding: 16px;

  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  background: var(--background);
}

.service-form__heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-form__title {
  margin: 0;

  color: var(--text);
  font-size: 14px;
  font-weight: 700;
}

.service-form__description {
  margin: 0;

  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.service-form__fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.service-form__error {
  margin: 0;

  color: var(--danger);
  font-size: 12px;
  line-height: 1.5;
}
</style>
