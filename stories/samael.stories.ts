import type { Meta } from '@storybook/html'
import { createPetStory } from './pet-story.js'

const meta: Meta = {
  title: 'Pets/Samael (gato blanco)',
  tags: ['autodocs'],
}
export default meta

const story = createPetStory('samael')
export const Default = { ...story, name: 'Samael — gato blanco, ojos celestes' }
