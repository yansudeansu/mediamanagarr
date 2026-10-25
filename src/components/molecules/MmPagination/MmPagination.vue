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

type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

const lastPage = computed(() => Math.max(1, props.totalPages))

const currentPage = computed(() => Math.min(Math.max(1, props.page), lastPage.value))

const pageItems = computed<PageItem[]>(() => {
  const total = lastPage.value
  const current = currentPage.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', total]
  }

  if (current >= total - 3) {
    return [1, 'ellipsis-start', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, 'ellipsis-start', current - 1, current, current + 1, 'ellipsis-end', total]
})

function goToPage(page: number) {
  if (!Number.isInteger(page) || page < 1 || page > lastPage.value || page === currentPage.value) {
    return
  }

  emit('update:page', page)
}
</script>

<template>
  <div v-if="lastPage > 1" class="pagination">
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

    <div class="pagination-pages">
      <template v-for="item in pageItems" :key="item">
        <span v-if="typeof item === 'string'" class="pagination-ellipsis" aria-hidden="true">
          …
        </span>

        <mm-button
          v-else
          variant="pagination"
          size="small"
          class="pagination-page"
          :class="{ active: item === currentPage }"
          :aria-label="`Page ${item}`"
          :aria-current="item === currentPage ? 'page' : undefined"
          :disabled="item === currentPage"
          @click="goToPage(item)"
        >
          {{ item }}
        </mm-button>
      </template>
    </div>

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
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;
  margin-top: 12px;
  padding: 14px 0 4px;

  border-top: 1px solid var(--border);
}

.pagination-pages {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  min-width: 0;
}

.pagination-page {
  width: 30px;
  min-width: 30px;
  padding: 0;
}

.pagination-arrow {
  width: 32px;
  min-width: 32px;
  padding: 0;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  color: var(--muted);
  font-size: 13px;
  user-select: none;
}
</style>
