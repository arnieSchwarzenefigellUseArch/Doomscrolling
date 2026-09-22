import {isPlatformBrowser} from '@angular/common';
import {afterNextRender, Component, ElementRef, inject, PLATFORM_ID} from '@angular/core';
import {ResizeRule} from '@shared/types/button';
import {IconButton} from '@shared/ui/button/button';
import {gsap} from 'gsap';
import {MorphSVGPlugin} from 'gsap/MorphSVGPlugin';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

@Component({
  imports: [IconButton],
  selector: 'app-floating-button',
  styleUrl: './floating-button.scss',
  templateUrl: './floating-button.html',
})
export class FloatingButton {
  private readonly elementRef = inject(ElementRef);
  private readonly arrowUp =
    'M342.6 73.4C330.1 60.9 309.8 60.9 297.3 73.4L137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7C149.8 291.2 170.1 291.2 182.6 278.7L288 173.3L288 544C288 561.7 302.3 576 320 576C337.7 576 352 561.7 352 544L352 173.3L457.4 278.7C469.9 291.2 490.2 291.2 502.7 278.7C515.2 266.2 515.2 245.9 502.7 233.4L342.7 73.4z';
  private platformId = inject(PLATFORM_ID);

  private readonly angleUp =
    'M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z';
  public resizeRules: ResizeRule[] = [
    {
      breakpoint: 'tablet',
      direction: 'down',
      size: 'md',
    },
  ];

  constructor() {
    gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger);
    afterNextRender(() => {
      this.setupScrollHide();
    });
  }
  morphToArrow(el: HTMLElement) {
    gsap.to(el, {
      morphSVG: this.arrowUp,
      duration: 0.15,
      ease: 'power2.out',
    });
  }

  morphToAngle(el: HTMLElement) {
    gsap.to(el, {
      morphSVG: this.angleUp,
      duration: 0.15,
      ease: 'power2.out',
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  setupScrollHide() {
    const hostEl = this.elementRef.nativeElement as HTMLElement;
    gsap.set(hostEl, {
      autoAlpha: 0,
      scale: 0.3,
      transformOrigin: 'center center',
      pointerEvents: 'none',
    });
    ScrollTrigger.create({
      trigger: 'body',
      start: () => {
        return `top+=${window.innerHeight * 0.2} top`;
      },
      onEnter: () => {
        gsap.to(hostEl, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
          pointerEvents: 'auto',
        });
      },
      onLeaveBack: () => {
        gsap.to(hostEl, {
          autoAlpha: 0,
          scale: 0.3,
          duration: 0.2,
          ease: 'power2.in',
          overwrite: 'auto',
          pointerEvents: 'none',
        });
      },
    });
  }
}
