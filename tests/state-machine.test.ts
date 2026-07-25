import { describe, expect, it } from 'vitest';
import { buildTransitions, StateMachine } from '../src/animations/state-machine.js';
import type { BehaviorState } from '../src/types.js';

const baseState: BehaviorState = { animation: 'idle', x: 0, y: 0, direction: 1 };

describe('StateMachine', () => {
  it('starts in the initial state', () => {
    const sm = new StateMachine('idle', buildTransitions(800, 30));

    expect(sm.state).toBe('idle');
  });

  it('transitions from idle to walk states', () => {
    for (const target of ['walk-left', 'walk-right', 'walk-up', 'walk-down'] as const) {
      const sm = new StateMachine('idle', buildTransitions(800, 30));
      const next = sm.send(target, baseState);

      expect(sm.state).toBe(target);
      expect(next.animation).toBe(target);
    }
  });

  it('does not transition to peek when x is not at right edge', () => {
    const sm = new StateMachine('walk-right', buildTransitions(800, 30));

    sm.send('peek', { ...baseState, animation: 'walk-right', x: 100 });
    expect(sm.state).toBe('walk-right');
  });

  it('transitions to peek when x >= viewportWidth - size', () => {
    const sm = new StateMachine('walk-right', buildTransitions(800, 30));

    sm.send('peek', { ...baseState, animation: 'walk-right', x: 770 });
    expect(sm.state).toBe('peek');
  });

  it('transitions from peek to jump', () => {
    const sm = new StateMachine('peek', buildTransitions(800, 30));

    sm.send('jump', { ...baseState, animation: 'peek' });
    expect(sm.state).toBe('jump');
  });

  it('transitions from peek to heart', () => {
    const sm = new StateMachine('peek', buildTransitions(800, 30));

    sm.send('heart', { ...baseState, animation: 'peek' });
    expect(sm.state).toBe('heart');
  });

  it('uses wildcard fallback to return to idle from any state', () => {
    const sm = new StateMachine('jump', buildTransitions(800, 30));

    sm.send('idle', { ...baseState, animation: 'jump' });
    expect(sm.state).toBe('idle');
  });

  it('canTransition returns false when guard fails', () => {
    const sm = new StateMachine('walk-right', buildTransitions(800, 30));
    const can = sm.canTransition('peek', { ...baseState, animation: 'walk-right', x: 0 });

    expect(can).toBe(false);
  });

  it('canTransition returns true when guard passes', () => {
    const sm = new StateMachine('walk-right', buildTransitions(800, 30));
    const can = sm.canTransition('peek', { ...baseState, animation: 'walk-right', x: 790 });

    expect(can).toBe(true);
  });

  it('reset allows restarting from a given state', () => {
    const sm = new StateMachine('idle', buildTransitions(800, 30));

    sm.send('walk-left', baseState);
    sm.reset('idle');
    expect(sm.state).toBe('idle');
  });
});
