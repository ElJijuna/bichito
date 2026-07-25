import { bichito } from '../src/index.js';
import type { AnimationState, PetId } from '../src/types.js';

export interface PetStoryArgs {
  size: number;
  animate: boolean;
}

export function createPetStory(petId: PetId) {
  return {
    render(args: PetStoryArgs) {
      const container = document.createElement('div');

      container.style.cssText =
        'position:relative;width:320px;height:240px;border:1px dashed #ccc;overflow:hidden;background:#fafafa';

      const label = document.createElement('p');

      label.textContent = petId;
      label.style.cssText =
        'margin:0;padding:4px 8px;font-family:monospace;font-size:11px;color:#888';
      container.appendChild(label);

      let destroy: (() => void) | null = null;

      const start = () => {
        if (destroy) {
          destroy();
        }

        destroy = bichito({ pet: petId, size: args.size, container });
      };

      if (args.animate) {
        start();
      }

      const btn = document.createElement('button');

      btn.textContent = destroy ? 'Stop' : 'Start';
      btn.style.cssText =
        'position:absolute;bottom:8px;right:8px;padding:4px 10px;font-size:11px;cursor:pointer';
      btn.addEventListener('click', () => {
        if (destroy) {
          destroy();
          destroy = null;
          btn.textContent = 'Start';
        } else {
          start();
          btn.textContent = 'Stop';
        }
      });
      container.appendChild(btn);

      return container;
    },

    args: {
      size: 60,
      animate: true,
    } satisfies PetStoryArgs,

    argTypes: {
      size: { control: { type: 'range', min: 20, max: 120, step: 10 } },
      animate: { control: 'boolean' },
    },
  };
}
