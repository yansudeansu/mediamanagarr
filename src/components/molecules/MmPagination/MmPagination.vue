<script setup lang="ts">
import { computed } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'

interface Props {
  page: number
  totalPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const lastPage = computed(() => Math.max(1, props.totalPages))

const currentPage = computed(() => Math.min(Math.max(1, props.page), lastPage.value))

function goToPage(page: number) {
  if (!Number.isInteger(page) || page < 1 || page > lastPage.value || page === currentPage.value) {
    return
  }

  emit('update:page', page)
}
</script>

<template>
  <nav v-if="lastPage > 1" class="pagination" aria-label="Pagination">
    <mm-button
      variant="pagination"
      size="small"
      icon="arrow-left"
      icon-only
      class="pagination-arrow"
      aria-label="Previous page"
      :disabled="currentPage <= 1"
      @click="goToPage(currentPage - 1)"
    />

    <span class="pagination-label" aria-live="polite" aria-atomic="true">
      Page {{ currentPage }} of {{ lastPage }}
    </span>

    <mm-button
      variant="pagination"
      size="small"
      icon="arrow-right"
      icon-only
      class="pagination-arrow"
      aria-label="Next page"
      :disabled="currentPage >= lastPage"
      @click="goToPage(currentPage + 1)"
    />
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-3);
  padding: 14px 0 var(--space-1);
  border-top: 1px solid var(--border);
}

.pagination-arrow {
  flex: 0 0 32px;
  width: 32px;
  min-width: 32px;
  padding: 0;
}

.pagination-label {
  min-width: 100px;
  color: var(--muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
