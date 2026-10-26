import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmMediaPoster from './MmMediaPoster.vue'

const meta = {
  title: 'Atoms/MediaPoster',
  component: MmMediaPoster,
  tags: ['autodocs'],
  args: {
    title: 'Example Movie',
    type: 'movie',
    image: null,
    size: 'default',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MmMediaPoster>

export default meta

type Story = StoryObj<typeof meta>

export const MoviePlaceholder: Story = {}

export const TvPlaceholder: Story = {
  args: {
    title: 'Example Series',
    type: 'tv',
  },
}

export const MovieWithImage: Story = {
  args: {
    image: 'https://placehold.co/128x192/272c35/e5e7eb?text=Movie',
  },
}

export const TvWithImage: Story = {
  args: {
    title: 'Example Series',
    type: 'tv',
    image: 'https://placehold.co/128x192/272c35/e5e7eb?text=TV',
  },
}

export const SmallMovie: Story = {
  args: {
    size: 'small',
  },
}

export const SmallTv: Story = {
  args: {
    title: 'Example Series',
    type: 'tv',
    size: 'small',
  },
}
