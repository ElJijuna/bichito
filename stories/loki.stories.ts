import type { Meta } from '@storybook/html'
import { createPetStory } from './pet-story.js'

const meta: Meta = {
  title: 'Pets/Loki (bulldog francés)',
  tags: ['autodocs'],
}
export default meta

const story = createPetStory('loki')
export const Default = { ...story, name: 'Loki — French Bulldog, blue pied, pecho blanco' }
