import {Directive, ElementRef, inject, AnimationCallbackEvent} from '@angular/core';
import {gsap} from 'gsap';
import '@shared/lib/animations/effects';

@Directive({
  selector: '[atomReveal]',
  host: {
    '(animate.enter)': 'revealEnter()',
    '(animate.leave)': 'revealLeave($event)',
  },
})
export class AtomReveal {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  revealEnter() {
    gsap.effects['atomRevealIn'](this.element.nativeElement);
  }
  revealLeave(event: AnimationCallbackEvent) {
    const tween = gsap.effects['atomRevealOut'](this.element.nativeElement);
    tween.eventCallback('onComplete', () => event.animationComplete());
  }
}

@Directive({
  selector: '[atomFade]',
  host: {
    '(animate.enter)': 'fadeEnter()',
    '(animate.leave)': 'fadeLeave($event)',
  },
})
export class AtomFade {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  fadeEnter() {
    gsap.effects['atomFadeIn'](this.element.nativeElement);
  }
  fadeLeave(event: AnimationCallbackEvent) {
    const tween = gsap.effects['atomFadeOut'](this.element.nativeElement);
    tween.eventCallback('onComplete', () => event.animationComplete());
  }
}
