import {Component, ElementRef, inject, viewChild} from '@angular/core';
import {TOAST_CLOSE, TOAST_DATA, TOAST_TIMER_PAUSE, TOAST_TIMER_RESUME} from './tokens';
import {IconButton} from '../button/button';
import {gsap} from 'gsap';
import {AtomReveal} from '@shared/directives/animations';
import '@shared/lib/animations/effects';

@Component({
  imports: [IconButton, AtomReveal],
  selector: 'atom-toast',
  styleUrl: './toast.scss',
  templateUrl: './toast.html',
})
export class ToastComponent {
  data = inject(TOAST_DATA);
  close = inject(TOAST_CLOSE);
  timerPause = inject(TOAST_TIMER_PAUSE);
  timerResume = inject(TOAST_TIMER_RESUME);
  
  private wrapper = viewChild<ElementRef<HTMLDivElement>>('toast');
  slideDownFirst() {
    const el = this.wrapper()?.nativeElement;
    if (!el) return;
    gsap.from(el, {
      y: -100,
      duration: 0.15,
    });
  }
  slideTo(y: number) {
    const el = this.wrapper()?.nativeElement;
    if (!el) return;
    gsap.to(el, {
      y,
      duration: 0.15,
    });
  }
  getWrapperHeight() {
    const el = this.wrapper()?.nativeElement;
    if (!el) return 0;
    return el.offsetHeight;
  }

  leave(onComplete: () => void) {
    const el = this.wrapper()?.nativeElement;
    if (!el) return;
    gsap.effects['atomRevealOut'](el, {onComplete});
  }
}
