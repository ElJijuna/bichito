import type { Meta } from '@storybook/html'
import { createPetStory } from './pet-story.js'

const meta: Meta = {
  title: 'Pets/Pizza (bulldog francés)',
  tags: ['autodocs'],
}
export default meta

const story = createPetStory('pizza')
export const Default = { ...story, name: 'Pizza — French Bulldog, blue merle pied' }
