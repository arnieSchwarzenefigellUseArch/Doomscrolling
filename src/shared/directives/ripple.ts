import {Directive, ElementRef, Renderer2, inject} from '@angular/core';

@Directive({
  selector: '[appRipple]',
  host: {
    '(pointerdown)': 'pointerDown($event)',
  },
})
export class Ripple {
  private elementRef: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  pointerDown(event: MouseEvent) {
    const el = this.elementRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ripple = this.renderer.createElement('span');
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'translate', '-50% -50%');
    this.renderer.addClass(ripple, 'ripple-circle');
    this.renderer.appendChild(this.elementRef.nativeElement, ripple);
    this.renderer.listen(ripple, 'animationend', () => {
      this.renderer.removeChild(el, ripple);
    });
  }
}
