import {DestroyRef, Directive, ElementRef, Renderer2, inject} from '@angular/core';

const RIPPLE_PADDING = 10 as const;

type RippleItem = {
  el: HTMLElement;
  animationFinished: boolean;
  timer: ReturnType<typeof setTimeout>;
};
@Directive({
  selector: '[atomRipple]',
})
export class Ripple {
  private elementRef: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private ripples: RippleItem[] = [];
  private unsubs: (() => void)[] = [];
  private pointerUp = false;

  constructor() {
    this.unsubs.push(
      this.renderer.listen(this.elementRef.nativeElement, 'pointerdown', (e: PointerEvent) =>
        this.onDown(e),
      ),
      this.renderer.listen(this.elementRef.nativeElement, 'pointerup', () => this.onUp()),
      this.renderer.listen(this.elementRef.nativeElement, 'pointercancel', () => this.onUp()),
      this.renderer.listen(this.elementRef.nativeElement, 'pointerleave', () => this.onUp()),
    );

    this.destroyRef.onDestroy(() => {
      this.unsubs?.forEach((fn) => fn());
      this.unsubs = [];
      for (const item of this.ripples) {
        clearTimeout(item.timer);
        this.renderer.removeChild(this.elementRef.nativeElement, item.el);
      }
      this.ripples = [];
    });
  }
  onDown(event: MouseEvent) {
    this.pointerUp = false;
    if (event.button !== 0 && (event as PointerEvent).pointerType === 'mouse') return;

    const el = this.elementRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = distanceToFurthestCorner(x, y, rect);
    const ripple = this.renderer.createElement('span');
    this.renderer.setStyle(ripple, 'left', `${x - radius}px`);
    this.renderer.setStyle(ripple, 'top', `${y - radius}px`);
    this.renderer.setStyle(ripple, 'width', `${radius * 2}px`);
    this.renderer.setStyle(ripple, 'height', `${radius * 2}px`);
    this.renderer.addClass(ripple, 'ripple-circle');
    this.renderer.appendChild(this.elementRef.nativeElement, ripple);
    void ripple.offsetWidth;
    this.renderer.setStyle(ripple, 'transitionDuration', '300ms');
    this.renderer.setStyle(ripple, 'transform', 'scale3d(1, 1, 1)');
    const item: RippleItem = {
      el: ripple,
      animationFinished: false,
      timer: setTimeout(() => {
        item.animationFinished = true;
        this.tryRemove(item);
      }, 300),
    };
    this.ripples.push(item);
  }

  onUp() {
    this.pointerUp = true;
    for (const item of this.ripples) {
      this.tryRemove(item);
    }
  }
  tryRemove(item: RippleItem) {
    if (!this.pointerUp || !item.animationFinished) return;
    this.removeLogic(item);
  }
  remove(item: RippleItem) {
    this.removeLogic(item);
  }
  private removeLogic(item: RippleItem) {
    clearTimeout(item.timer);
    void item.el.offsetWidth;
    this.renderer.setStyle(item.el, 'opacity', '0');
    const unlistenExit = this.renderer.listen(item.el, 'transitionend', (e: TransitionEvent) => {
      if (e.propertyName !== 'opacity') return;
      unlistenExit();
      this.renderer.removeChild(this.elementRef.nativeElement, item.el);
      this.ripples = this.ripples.filter((i) => i !== item);
    });
  }
}

function distanceToFurthestCorner(x: number, y: number, rect: DOMRect) {
  const distX = Math.max(Math.abs(x - 0), Math.abs(x - rect.width));
  const distY = Math.max(Math.abs(y - 0), Math.abs(y - rect.height));
  return Math.sqrt(distX * distX + distY * distY) + RIPPLE_PADDING;
}
