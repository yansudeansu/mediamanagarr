import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmPagination from './MmPagination.vue'

const meta = {
  title: 'Molecules/Pagination',
  component: MmPagination,
  tags: ['autodocs'],
  args: {
    page: 1,
    totalPages: 10,
  },
  argTypes: {
    page: {
      control: {
        type: 'number',
        min: 1,
      },
    },
    totalPages: {
      control: {
        type: 'number',
        min: 0,
      },
    },
  },
} satisfies Meta<typeof MmPagination>

export default meta

type Story = StoryObj<typeof meta>

function interactiveStory() {
  return (args: { page: number; totalPages: number }) => ({
    components: { MmPagination },

    setup() {
      const currentPage = ref(args.page)

      watch(
        () => args.page,
        (page) => {
          currentPage.value = page
        },
      )

      return {
        args,
        currentPage,
      }
    },

    template: `
      <div style="width: 340px;">
        <MmPagination
          v-model:page="currentPage"
          :total-pages="args.totalPages"
        />
      </div>
    `,
  })
}

export const Default: Story = {
  render: interactiveStory(),
}

export const FirstPage: Story = {
  args: {
    page: 1,
    totalPages: 10,
  },
  render: interactiveStory(),
}

export const MiddlePage: Story = {
  args: {
    page: 5,
    totalPages: 10,
  },
  render: interactiveStory(),
}

export const LastPage: Story = {
  args: {
    page: 10,
    totalPages: 10,
  },
  render: interactiveStory(),
}

export const SinglePage: Story = {
  args: {
    page: 1,
    totalPages: 1,
  },
  render: interactiveStory(),
}

export const ManyPages: Story = {
  args: {
    page: 25,
    totalPages: 50,
  },
  render: interactiveStory(),
}
