import {
  Component,
  ElementRef,
  signal,
  viewChild,
  Renderer2,
  untracked,
  inject,
  afterRenderEffect,
  afterNextRender,
} from '@angular/core';
import {Ripple} from '@shared/directives/ripple';
import {gsap} from 'gsap';
import '@shared/lib/animations/easing';

@Component({
  imports: [],
  selector: 'dropdown',
  styleUrl: './dropdown.scss',
  templateUrl: './dropdown.html',
  host: {
    '(click)': 'toggle()',
  },
  hostDirectives: [Ripple],
})
export class Dropdown {
  private state = signal('closed');
  private elementRef = inject(ElementRef);
  private dropdownBody = viewChild<ElementRef<HTMLDivElement>>('dropdownBody');
  private renderer = inject(Renderer2);

  toggle() {
    this.state() === 'closed' ? this.state.set('open') : this.state.set('closed');
  }

  addCloseClass() {
    this.renderer.removeClass(this.elementRef.nativeElement, 'opened');
    this.renderer.addClass(this.elementRef.nativeElement, 'closed');
  }

  addOpenClass() {
    this.renderer.removeClass(this.elementRef.nativeElement, 'closed');
    this.renderer.addClass(this.elementRef.nativeElement, 'opened');
  }

  constructor() {
    afterNextRender(() => {
      const el = this.dropdownBody()?.nativeElement;
      if (!el) return;
      gsap.set(el, {height: 0});
    });

    afterRenderEffect(() => {
      const el = this.dropdownBody()?.nativeElement;
      if (!el) return;
      const isClosed = this.state() === 'closed';
      untracked(() => {
        isClosed ? this.addCloseClass() : this.addOpenClass();
      });

      gsap.to(el, {
        height: isClosed ? 0 : 'auto',
        duration: 0.3,
        ease: 'standard',
        overwrite: 'auto',
      });
    });
  }
}
