import {afterNextRender, afterRenderEffect, Service, signal, WritableSignal} from '@angular/core';
import {
  DEFAULT_SIDEBAR_STATE,
  SIDEBAR_STATE_LOCALSTORAGE_KEY,
  type SidebarState,
} from '../sidebar.model';
import {breakpointQuery} from '@shared/lib/utils/breakpoint/breakpoint';
import type {Breakpoints} from '@shared/types/breakpoints';

@Service()
export class SidebarStateService {
  private readonly _state: WritableSignal<SidebarState> = signal<SidebarState>('collapsed');
  private _bpQuery!: keyof Breakpoints;
  private _mm!: MediaQueryList;
  readonly isMobile: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    afterNextRender({
      earlyRead: () => {
        this._bpQuery = 'laptop';
        this._mm = matchMedia(breakpointQuery(this._bpQuery));
        this.isMobile.set(this._mm.matches);
        this._state.set(this.readSavedState());
      },
    });
    afterRenderEffect({
      earlyRead: (onCleanup) => {
        const handler = (e: MediaQueryListEvent) => {
          this.isMobile.set(e.matches);
        };

        this._mm.addEventListener('change', handler);

        onCleanup(() => this._mm.removeEventListener('change', handler));
      },
      write: () => {
        const state = this._state();
        localStorage.setItem(SIDEBAR_STATE_LOCALSTORAGE_KEY, state);
      },
    });
  }

  private readSavedState() {
    if (this.isMobile()) return DEFAULT_SIDEBAR_STATE;
    return (
      (localStorage.getItem(SIDEBAR_STATE_LOCALSTORAGE_KEY) as SidebarState | null) ??
      DEFAULT_SIDEBAR_STATE
    );
  }

  changeState() {
    return this._state() === 'collapsed'
      ? this._state.set('expanded')
      : this._state.set('collapsed');
  }

  getState() {
    return this._state.asReadonly();
  }
}
