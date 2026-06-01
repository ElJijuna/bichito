import type { AnimationState } from '../types.js'

const BEHAVIOR_POOL: AnimationState[] = [
  'idle',
  'idle',
  'walk-left',
  'walk-left',
  'walk-right',
  'walk-right',
  'walk-up',
  'walk-down',
]

export function pickNextBehavior(
  current: AnimationState,
  rand: () => number = Math.random,
): AnimationState {
  const candidates = BEHAVIOR_POOL.filter((s) => s !== current)
  const idx = Math.floor(rand() * candidates.length)
  return candidates[idx] ?? 'idle'
}

export interface SchedulerOptions {
  onFrame: (elapsed: number) => void
  onBehaviorTick: () => void
  behaviorIntervalMs?: number
}

export class Scheduler {
  private rafId: number | null = null
  private lastTime = 0
  private lastBehaviorTime = 0
  private behaviorIntervalMs: number

  constructor(behaviorIntervalMs = 3000) {
    this.behaviorIntervalMs = behaviorIntervalMs
  }

  start(opts: SchedulerOptions): void {
    const interval = opts.behaviorIntervalMs ?? this.behaviorIntervalMs

    const loop = (now: number) => {
      const elapsed = now - this.lastTime
      this.lastTime = now

      opts.onFrame(elapsed)

      if (now - this.lastBehaviorTime >= interval) {
        this.lastBehaviorTime = now
        opts.onBehaviorTick()
      }

      this.rafId = requestAnimationFrame(loop)
    }

    this.rafId = requestAnimationFrame((now) => {
      this.lastTime = now
      this.lastBehaviorTime = now
      loop(now)
    })
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }
}
