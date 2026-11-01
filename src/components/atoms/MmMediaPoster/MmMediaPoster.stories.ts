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

  argTypes: {
    title: {
      control: 'text',
      description: 'Media title used for accessible image descriptions.',
    },
    type: {
      control: 'select',
      options: ['movie', 'tv'],
      description: 'Media type used to select the placeholder icon.',
    },
    image: {
      control: 'text',
      description: 'Optional poster image URL. Clear the value to show the placeholder.',
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Poster display size.',
    },
  },

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

/**
 * Interactive playground for all poster properties.
 */
export const Playground: Story = {}

/**
 * Movie placeholder when no poster image is available.
 */
export const MoviePlaceholder: Story = {}

/**
 * TV placeholder when no poster image is available.
 */
export const TvPlaceholder: Story = {
  args: {
    title: 'Example TV Show',
    type: 'tv',
  },
}

/**
 * Movie poster with an image.
 */
export const MovieWithImage: Story = {
  args: {
    image: createPoster('Movie'),
  },
}

/**
 * TV poster with an image.
 */
export const TvWithImage: Story = {
  args: {
    title: 'Example TV Show',
    type: 'tv',
    image: createPoster('TV'),
  },
}

/**
 * Small movie placeholder.
 */
export const SmallMovie: Story = {
  args: {
    size: 'small',
  },
}

/**
 * Small TV placeholder.
 */
export const SmallTv: Story = {
  args: {
    title: 'Example TV Show',
    type: 'tv',
    size: 'small',
  },
}

/**
 * Small poster with an image.
 */
export const SmallWithImage: Story = {
  args: {
    image: createPoster('Movie'),
    size: 'small',
  },
}
