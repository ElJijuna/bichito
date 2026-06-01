import { describe, it, expect } from 'vitest'
import { PET_REGISTRY } from '../src/pets/index.js'
import type { AnimationState, PetId } from '../src/types.js'

const ALL_STATES: AnimationState[] = [
  'idle', 'walk-left', 'walk-right', 'walk-up', 'walk-down', 'peek', 'jump', 'heart',
]

const PET_IDS: PetId[] = ['ariel', 'cain', 'samael', 'thor', 'loki', 'pizza']

const CSS_HEX = /^#[0-9a-f]{3,8}$/i

describe('PET_REGISTRY', () => {
  it('contains all 6 pets', () => {
    for (const id of PET_IDS) {
      expect(PET_REGISTRY[id]).toBeDefined()
      expect(PET_REGISTRY[id]!.id).toBe(id)
    }
  })

  for (const id of PET_IDS) {
    describe(`${id}`, () => {
      const def = PET_REGISTRY[id]!

      it('has all 8 AnimationState clips', () => {
        for (const state of ALL_STATES) {
          expect(def.clips[state], `missing clip: ${state}`).toBeDefined()
        }
      })

      it('every clip has at least 1 frame', () => {
        for (const state of ALL_STATES) {
          expect(def.clips[state]!.frames.length).toBeGreaterThan(0)
        }
      })

      it('every clip has a positive fps', () => {
        for (const state of ALL_STATES) {
          expect(def.clips[state]!.fps).toBeGreaterThan(0)
        }
      })

      it('every frame is a 30-row array', () => {
        for (const state of ALL_STATES) {
          for (const frame of def.clips[state]!.frames) {
            expect(frame.length).toBe(30)
          }
        }
      })

      it('every row has 30 columns', () => {
        for (const state of ALL_STATES) {
          for (const frame of def.clips[state]!.frames) {
            for (const row of frame) {
              expect(row.length).toBe(30)
            }
          }
        }
      })

      it('all non-null pixel values are valid CSS hex colors', () => {
        for (const state of ALL_STATES) {
          for (const frame of def.clips[state]!.frames) {
            for (const row of frame) {
              for (const px of row) {
                if (px !== null) {
                  expect(px, `invalid color: ${px}`).toMatch(CSS_HEX)
                }
              }
            }
          }
        }
      })
    })
  }
})
