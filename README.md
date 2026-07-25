# bichito 🐾

Add an animated pixel-art desktop pet to any web page.

Six named pets, zero dependencies, works via CDN `<script>` tag or npm ESM import.

---

## Quick start — CDN

```html
<script src="https://cdn.jsdelivr.net/npm/bichito/dist/bichito.global.js"></script>
<script>
  Bichito.bichito({ pet: 'ariel' })
</script>
```

## Quick start — npm

```bash
npm install bichito
```

```ts
import { bichito } from 'bichito'

const destroy = bichito({ pet: 'cain', size: 40 })

// Call destroy() to remove the pet
```

---

## API

```ts
bichito(config?: BichitoConfig): () => void
```

| Option | Type | Default | Description |
|---|---|---|---|
| `pet` | `PetId` | `'ariel'` | Which pet to show |
| `size` | `number` | `30` | Render size in pixels (width = height) |
| `container` | `HTMLElement` | `document.body` | DOM element to attach the pet to |

Returns a **destroy function** — call it to stop the pet and remove its canvas. Useful for SPAs and cleanup.

---

## Pets

| ID | Species | Description |
|---|---|---|
| `ariel` | Cat | Solid black coat, bright green eyes |
| `cain` | Cat | Amber tabby with dark banding, yellow eyes, one white paw |
| `samael` | Cat | White coat, ice-blue eyes |
| `thor` | French Bulldog | Blue pied, warm brown eyes |
| `loki` | French Bulldog | Fawn with a dark mask, green eyes |
| `pizza` | French Bulldog | Blue merle, pale blue eyes |

Cats and French bulldogs have genuinely different silhouettes — the frenchies get
tall bat ears, a wide flat muzzle and a stubby tail.

---

## Behaviors

| Behavior | How it triggers |
|---|---|
| **Idle** | Random, between walks — the pet breathes and blinks |
| **Walk left / right** | Random, every 3–6 seconds — four-key side walk cycle |
| **Walk up / down** | Random — back view walking away, front view walking toward you |
| **Peek** | Pet walks to the right edge, leans in and watches you |
| **Heart bubble** | Click the pet — a speech bubble pops up with a beating pixel heart |
| **Jump** | Click the pet while it peeks (50% chance) — crouch, launch, hang, land |
| **Heart** | Click the pet while it peeks (50% chance) — the pet beams and a heart floats up |

Clicking anywhere on the pet pops the heart bubble. It tracks the pet while it
keeps walking, drifts upward, fades out after ~1.5s, and stays inside the
viewport when the pet is against an edge.

Every clip animates: no state renders as a still image, and the walk cycles use
four distinct key frames rather than repeating two.

---

## Visualize with Storybook

```bash
npm run storybook
```

Opens at `http://localhost:6006`. Each pet has its own story with size control and start/stop toggle.

---

## Development

```bash
npm install          # install deps
npm test             # run tests (vitest)
npm run typecheck    # TypeScript strict check
npm run build        # build ESM + CJS + IIFE bundles
npm run storybook    # Storybook dev server
```

---

## Adding a new pet

Most pets are a re-skin of an existing species, so they are a palette and nothing else:

```ts
// src/pets/<name>.ts
import { buildClips } from './build-clips.js'
import { CAT_POSES } from './cat-art.js'

export const myPetDefinition: PetDefinition = {
  id: 'mypet',
  clips: buildClips(CAT_POSES, { outline: '#…', body: '#…' /* …SpeciesColors */ }),
}
```

Then register it in `src/pets/index.ts`, add the id to the `PetId` union in
`src/types.ts`, and add `stories/<name>.stories.ts`.

For breed markings (stripes, a mask, merle patches) wrap the clips in
`applyMarkings()` with a per-pixel function instead of redrawing the art — see
`cain.ts`, `loki.ts` and `pizza.ts`.

### Drawing a new species

Sprites are authored as 30×30 character grids rather than colour arrays, so the
art stays readable and editable in source:

```ts
export const FRONT = [
  '........oo..........oo........',
  '.......oyBo........oByo.......',
  // …30 rows of 30 chars
]
```

`.` is transparent and each other character maps to a `SpeciesColors` slot
(`o` outline, `B` body, `G` iris, `P` pupil, `n` nose, …). Supply the eleven
poses of a `PoseSet` — front, blink, happy, four walk keys, back, peek, crouch,
stretch — and `buildClips()` assembles all eight animation clips from them.
`parseFrame()` throws at import time if a grid is not 30×30 or uses an
undeclared character.

---

## License

MIT © el_jijuna
