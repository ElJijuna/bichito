export type PetId = 'ariel' | 'cain' | 'samael' | 'thor' | 'loki' | 'pizza'

export type AnimationState =
  | 'idle'
  | 'walk-left'
  | 'walk-right'
  | 'walk-up'
  | 'walk-down'
  | 'peek'
  | 'jump'
  | 'heart'

export type PixelRow = (string | null)[]
export type SpriteFrame = PixelRow[]

export interface AnimationClip {
  frames: SpriteFrame[]
  fps: number
  loop: boolean
}

export interface PetDefinition {
  id: PetId
  clips: Record<AnimationState, AnimationClip>
}

export interface BichitoConfig {
  pet?: PetId
  size?: number
  container?: HTMLElement
}

export interface BehaviorState {
  animation: AnimationState
  x: number
  y: number
  direction: 1 | -1
}

export interface Transition {
  from: AnimationState | AnimationState[] | '*'
  to: AnimationState
  guard?: (state: BehaviorState) => boolean
  action?: (state: BehaviorState) => Partial<BehaviorState>
}
