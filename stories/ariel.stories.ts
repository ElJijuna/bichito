import type { Meta } from '@storybook/html';
import { createPetStory } from './pet-story.js';

const meta: Meta = {
  title: 'Pets/Ariel (gato negro)',
  tags: ['autodocs'],
};

export default meta;

const story = createPetStory('ariel');

export const Default = { ...story, name: 'Ariel — gato negro, ojos verdes' };
