import {inject, PLATFORM_ID, Service, signal, WritableSignal} from '@angular/core';
import {debounceTime, fromEvent, map} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {isPlatformBrowser} from '@angular/common';

@Service()
export class Resize {
  private readonly platformId = inject(PLATFORM_ID);
  readonly width = isPlatformBrowser(this.platformId)
    ? toSignal(
        fromEvent(window, 'resize').pipe(
          debounceTime(150),
          map(() => window.innerWidth),
        ),
        {initialValue: window.innerWidth},
      )
    : signal(0);
}
