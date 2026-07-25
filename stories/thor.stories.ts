import type { Meta } from '@storybook/html';
import { createPetStory } from './pet-story.js';

const meta: Meta = {
  title: 'Pets/Thor (bulldog francés)',
  tags: ['autodocs'],
};

export default meta;

const story = createPetStory('thor');

export const Default = { ...story, name: 'Thor — French Bulldog, blue pied' };
