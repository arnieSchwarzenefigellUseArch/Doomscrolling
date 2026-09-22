import {type FsmState} from './fsm.types';
import {BehaviorSubject, Observable} from 'rxjs';

const DEFAULT_WARN_MESSAGE = '[FSM Warn]';
const DEFAULT_PANIC_MESSAGE = '[FSM Panic]';
export class FSMError extends Error {
  constructor(message: string) {
    super(`${DEFAULT_PANIC_MESSAGE}: ${message}`);
    this.name = 'FSMError';
  }
}
export class FSM<State extends string, Event extends string> {
  private readonly _currentState: BehaviorSubject<State>;
  private readonly transitions: Record<State, Partial<Record<Uppercase<Event>, State>>>;
  private readonly handlers: Record<State, () => void>;
  private readonly persistKey?: string;

  constructor(config: FsmState<State, Event>) {
    const validStates = Object.keys(config.handlers);
    if (!validStates.includes(config.initial)) {
      this._panic(`Invalid initial state: ${config.initial}`);
    }
    for (const [state, events] of Object.entries(config.transitions)) {
      if (!events) continue;
      for (const [event, nextState] of Object.entries(events)) {
        if (nextState && !validStates.includes(nextState as State)) {
          this._panic(`Invalid transition: ${state} -> ${nextState} (${event})`);
        }
      }
    }
    let initialState = config.initial;
    this.transitions = config.transitions;
    this.persistKey = config.persistKey;
    if (this.persistKey) {
      const savedState = localStorage.getItem(this.persistKey) as State | null;
      if (savedState && validStates.includes(savedState)) {
        initialState = savedState;
      }
    }
    this._currentState = new BehaviorSubject(initialState);
    this.handlers = config.handlers;
    this.handlers[this.value]?.();
  }

  public static create<State extends string, Event extends string>(config: FsmState<State, Event>) {
    return new FSM<State, Event>(config);
  }

  public static createToggle(openHandler: () => void, closeHandler: () => void) {
    return FSM.create({
      initial: 'closed',
      transitions: {
        closed: {OPEN: 'open'},
        open: {CLOSE: 'closed'},
      },
      handlers: {
        open: openHandler,
        closed: closeHandler,
      },
    });
  }

  private _warn(message: string) {
    console.warn(`${DEFAULT_WARN_MESSAGE}: ${message}`);
  }

  private _panic(message: string) {
    throw new FSMError(message);
  }

  public get state(): Observable<State> {
    return this._currentState.asObservable();
  }

  public get value(): State {
    return this._currentState.value;
  }

  public dispatch(event: Event) {
    const formattedEvent = event.toUpperCase() as Uppercase<Event>;
    const nextState = this.transitions[this.value]?.[formattedEvent];
    if (nextState) {
      this._currentState.next(nextState);
      if (this.persistKey) {
        localStorage.setItem(this.persistKey, nextState);
      }
      this.handlers[nextState]?.();
      return true;
    }

    this._warn(`No transition for event: ${event} in state: ${this.value}`);
    return false;
  }

  public destroy() {
    this._currentState.complete();
  }
  public clearPersistentState() {
    if (this.persistKey) {
      localStorage.removeItem(this.persistKey);
    } else {
      this._warn(`There is no persist key`);
    }
  }
}
