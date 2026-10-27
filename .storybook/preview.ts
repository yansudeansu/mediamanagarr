import type { Preview } from '@storybook/vue3-vite'
import { themes } from 'storybook/theming'

import '../src/styles/app.css'

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
}

export default preview
