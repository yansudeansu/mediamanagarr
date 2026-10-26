import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmMediaPoster from './MmMediaPoster.vue'

const createPoster = (label: string): string =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192">
      <rect width="128" height="192" fill="#272c35"/>
      <text x="64" y="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" fill="#e5e7eb">${label}</text>
    </svg>`,
  )

const meta = {
  title: 'Atoms/MediaPoster',
  component: MmMediaPoster,
  tags: ['autodocs'],
  args: {
    title: 'Movie 1',
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
    title: 'TV Show 1',
    type: 'tv',
  },
}

export const MovieWithImage: Story = {
  args: {
    image: createPoster('Movie 1'),
  },
}

export const TvWithImage: Story = {
  args: {
    title: 'TV Show 1',
    type: 'tv',
    image: createPoster('TV Show 1'),
  },
}

export const SmallMovie: Story = {
  args: {
    size: 'small',
  },
}

export const SmallTv: Story = {
  args: {
    title: 'TV Show 1',
    type: 'tv',
    size: 'small',
  },
}
