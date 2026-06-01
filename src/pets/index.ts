export { arielDefinition } from './ariel.js'
export { cainDefinition } from './cain.js'
export { samaelDefinition } from './samael.js'
export { thorDefinition } from './thor.js'
export { lokiDefinition } from './loki.js'
export { pizzaDefinition } from './pizza.js'

import { arielDefinition } from './ariel.js'
import { cainDefinition } from './cain.js'
import { samaelDefinition } from './samael.js'
import { thorDefinition } from './thor.js'
import { lokiDefinition } from './loki.js'
import { pizzaDefinition } from './pizza.js'
import type { PetId, PetDefinition } from '../types.js'

export const PET_REGISTRY: Record<PetId, PetDefinition> = {
  ariel: arielDefinition,
  cain: cainDefinition,
  samael: samaelDefinition,
  thor: thorDefinition,
  loki: lokiDefinition,
  pizza: pizzaDefinition,
}
