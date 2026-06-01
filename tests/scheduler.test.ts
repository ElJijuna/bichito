import { describe, it, expect, vi } from 'vitest'
import { pickNextBehavior, Scheduler } from '../src/animations/scheduler.js'
import type { AnimationState } from '../src/types.js'

const eventStates: AnimationState[] = ['peek', 'jump', 'heart']

describe('pickNextBehavior', () => {
  it('never returns peek, jump, or heart', () => {
    for (let i = 0; i < 200; i++) {
      const result = pickNextBehavior('idle')
      expect(eventStates).not.toContain(result)
    }
  })

  it('returns a different state than current when possible', () => {
    const result = pickNextBehavior('idle', () => 0)
    expect(result).not.toBe('idle')
  })

  it('uses the provided random function', () => {
    const rand = vi.fn(() => 0)
    pickNextBehavior('walk-left', rand)
    expect(rand).toHaveBeenCalled()
  })
})

describe('Scheduler', () => {
  it('calls onFrame after start', () => {
    const onFrame = vi.fn()
    const onBehaviorTick = vi.fn()

    const rafCalls: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCalls.push(cb)
      return rafCalls.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    const scheduler = new Scheduler()
    scheduler.start({ onFrame, onBehaviorTick, behaviorIntervalMs: 10000 })

    // First rAF fires to capture timestamp
    rafCalls[0]?.(0)
    // Second fires the loop
    rafCalls[1]?.(16)

    expect(onFrame).toHaveBeenCalled()

    scheduler.stop()
    vi.unstubAllGlobals()
  })

  it('calls onBehaviorTick when interval elapses', () => {
    const onFrame = vi.fn()
    const onBehaviorTick = vi.fn()

    const rafCalls: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCalls.push(cb)
      return rafCalls.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    const scheduler = new Scheduler(100)
    scheduler.start({ onFrame, onBehaviorTick })

    rafCalls[0]?.(0)     // init
    rafCalls[1]?.(200)   // 200ms elapsed → triggers behavior tick

    expect(onBehaviorTick).toHaveBeenCalled()

    scheduler.stop()
    vi.unstubAllGlobals()
  })

  it('stop cancels the animation frame', () => {
    const cancelMock = vi.fn()
    const rafCalls: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCalls.push(cb)
      return rafCalls.length
    })
    vi.stubGlobal('cancelAnimationFrame', cancelMock)

    const scheduler = new Scheduler()
    scheduler.start({ onFrame: vi.fn(), onBehaviorTick: vi.fn() })
    scheduler.stop()

    expect(cancelMock).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
