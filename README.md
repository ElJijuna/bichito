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

| ID | Especie | Descripción |
|---|---|---|
| `ariel` | Gato | Negro, ojos verdes |
| `cain` | Gato | Amarillo atigrado, pata derecha blanca, pecho blanco, ojos amarillos |
| `samael` | Gato | Blanco, ojos celestes |
| `thor` | French Bulldog | Blue pied |
| `loki` | French Bulldog | Blue pied, pecho blanco |
| `pizza` | French Bulldog | Blue merle pied |

---

## Behaviors

| Behavior | How it triggers |
|---|---|
| **Idle** | Random, between walks |
| **Walk left / right / up / down** | Random, every 3–6 seconds |
| **Peek** | Pet walks to the right edge, stops and faces you |
| **Jump** | Click the pet while it peeks (50% chance) |
| **Heart** | Click the pet while it peeks (50% chance) — floating heart bubble |

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

1. Create `src/pets/<name>.ts` — export a `PetDefinition` with all 8 `AnimationState` clips
2. Add it to `src/pets/index.ts` — register in `PET_REGISTRY`
3. Add `<name>` to the `PetId` union in `src/types.ts`
4. Create `stories/<name>.stories.ts`

Each sprite frame is a 30×30 array of CSS hex strings or `null` (transparent). Use `buildFrame()` with a palette map to keep the data readable.

---

## License

MIT © el_jijuna
