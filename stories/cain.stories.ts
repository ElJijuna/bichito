import type { Meta } from '@storybook/html';
import { createPetStory } from './pet-story.js';

const meta: Meta = {
  title: 'Pets/Cain (gato atigrado)',
  tags: ['autodocs'],
};

export default meta;

const story = createPetStory('cain');

export const Default = { ...story, name: 'Cain — gato amarillo atigrado, pata y pecho blancos' };
