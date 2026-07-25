import type { AnimationState, BehaviorState, Transition } from '../types.js';

export class StateMachine {
  private current: AnimationState;
  private readonly transitions: Transition[];

  constructor(initial: AnimationState, transitions: Transition[]) {
    this.current = initial;
    this.transitions = transitions;
  }

  get state(): AnimationState {
    return this.current;
  }

  canTransition(to: AnimationState, context: BehaviorState): boolean {
    return this.transitions.some((t) => {
      const fromMatch =
        t.from === '*' ||
        t.from === this.current ||
        (Array.isArray(t.from) && t.from.includes(this.current));
      const toMatch = t.to === to;
      const guardPass = t.guard === undefined || t.guard(context);

      return fromMatch && toMatch && guardPass;
    });
  }

  send(event: AnimationState, context: BehaviorState): BehaviorState {
    const transition = this.transitions.find((t) => {
      const fromMatch =
        t.from === '*' ||
        t.from === this.current ||
        (Array.isArray(t.from) && t.from.includes(this.current));
      const toMatch = t.to === event;
      const guardPass = t.guard === undefined || t.guard(context);

      return fromMatch && toMatch && guardPass;
    });

    if (transition === undefined) {
      return context;
    }

    this.current = event;

    if (transition.action) {
      return { ...context, ...transition.action(context), animation: event };
    }

    return { ...context, animation: event };
  }

  reset(state: AnimationState): void {
    this.current = state;
  }
}

export function buildTransitions(viewportWidth: number, size: number): Transition[] {
  return [
    { from: 'idle', to: 'walk-left' },
    { from: 'idle', to: 'walk-right' },
    { from: 'idle', to: 'walk-up' },
    { from: 'idle', to: 'walk-down' },
    { from: ['walk-left', 'walk-right', 'walk-up', 'walk-down'], to: 'idle' },
    { from: 'walk-left', to: 'walk-right' },
    { from: 'walk-right', to: 'walk-left' },
    {
      from: 'walk-right',
      to: 'peek',
      guard: (s) => s.x >= viewportWidth - size,
    },
    {
      from: 'peek',
      to: 'jump',
    },
    {
      from: 'peek',
      to: 'heart',
    },
    { from: 'jump', to: 'idle' },
    { from: 'heart', to: 'idle' },
    { from: '*', to: 'idle' },
  ];
}
