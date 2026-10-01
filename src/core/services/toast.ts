import {isPlatformBrowser} from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  createEnvironmentInjector,
  DestroyRef,
  EnvironmentInjector,
  inject,
  PLATFORM_ID,
  Service,
} from '@angular/core';
import {Timer, TimerState} from '@shared/lib/utils/timer';
import {ToastComponent} from '@shared/ui/toast/toast';
import {ToastData, TOAST_DATA, TOAST_CLOSE, TOAST_TIMER_PAUSE, TOAST_TIMER_RESUME} from '@shared/ui/toast/tokens';

@Service()
export class Toast {
  private timers = new Map<ComponentRef<ToastComponent>, TimerState>();
  private readonly appRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly parentInjector = inject(EnvironmentInjector);
  private active = new Set<ComponentRef<ToastComponent>>();
  private container: HTMLElement | null = null;
  constructor() {
    this.destroyRef.onDestroy(() => this.destroyAll());
  }
  show(data: ToastData) {
    const container = this.getContainer();
    let ref: ComponentRef<ToastComponent>;
    const toastInjector = createEnvironmentInjector(
      [
        {provide: TOAST_TIMER_PAUSE, useValue: () => this.pauseTimer(ref)},
        {provide: TOAST_TIMER_RESUME, useValue: () => this.resumeTimer(ref)},
        {provide: TOAST_DATA, useValue: data},
        {provide: TOAST_CLOSE, useValue: () => this.remove(ref)},
      ],
      this.parentInjector,
    );
    ref = createComponent(ToastComponent, {environmentInjector: toastInjector});
    ref.changeDetectorRef.detectChanges();
    this.active.add(ref);
    this.appRef.attachView(ref.hostView);
    container?.appendChild(ref.location.nativeElement);
    let timer = Timer.create(() => {
      this.remove(ref);
    }, 3000);
    this.timers.set(ref, timer);
    ref.instance.slideDownFirst();
    this.reflow();
    while (this.active.size > 3) {
      this.remove([...this.active][0]);
    }
  }

  private reflow() {
    let offset = 0;
    for (const ref of [...this.active].reverse()) {
      ref.instance.slideTo(offset);
      offset += ref.instance.getWrapperHeight() + 8;
    }
  }

  private pauseTimer(ref: ComponentRef<ToastComponent>) {
    const t = this.timers.get(ref);
    if (t?.state !== 'running') return;
    this.timers.set(ref, Timer.pause(t));
  }
  private resumeTimer(ref: ComponentRef<ToastComponent>) {
    const t = this.timers.get(ref);
    if (t?.state !== 'paused') return;
    const next = Timer.resume(t);
    if (next) this.timers.set(ref, next);
    else this.remove(ref); 
  }

  remove(ref: ComponentRef<ToastComponent>) {
    if (!this.active.has(ref)) return;
    const timer = this.timers.get(ref);
    if (!timer) return;
    Timer.destroy(timer);
    this.active.delete(ref);
    ref.instance.leave(() => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
    });
    this.reflow();
  }

  destroyAll() {
    for (const ref of this.active) {
      const timer = this.timers.get(ref);
      if (timer) Timer.destroy(timer);
      this.appRef.detachView(ref.hostView);
      this.remove(ref);
    }
    this.active.clear();
    this.container?.remove();
    this.container = null;
  }

  getContainer(): HTMLElement | null {
    if (!this.container) {
      if (!isPlatformBrowser(this.platformId)) return null;
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
    }
    return this.container;
  }
}