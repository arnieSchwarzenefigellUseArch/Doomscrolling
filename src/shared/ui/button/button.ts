import {Component, Directive, input, computed, inject, signal} from '@angular/core';
import type {ButtonAnimations, ButtonSizes, ButtonVariants, ResizeRule} from '@shared/types/button';
import {Ripple} from '@shared/directives/ripple';
import {BREAKPOINTS} from '@shared/constants/breakpoints';
import {Resize} from '@core/services/resize';

const BUTTON_HOST = {
  '[class]': 'classes()',
  '[attr.tabindex]': 'disable() ? -1 : null',
} as const;

@Directive()
export abstract class ButtonBase {
  public variant = input<ButtonVariants>('simple');
  public size = input<ButtonSizes>('md');
  private resizeService = inject(Resize);
  public disable = input<boolean>(false);
  public animation = input<ButtonAnimations>('none');
  public resizeRules = input<ResizeRule[]>([]);
  public dynamicSize = computed(() => {
    const width = this.resizeService.width();
    const rules = this.resizeRules();
    for (const rule of rules) {
      if (dynamicMatch(width, rule)) return rule.size;
    }
    return this.size();
  });
  protected classes = computed(() => {
    return {
      btn: true,
      [`btn-${this.variant()}`]: true,
      [`btn-${this.dynamicSize()}`]: true,
      'btn-border-sweep': this.animation() === 'border-sweep',
      disabled: this.disable(),
    };
  });
}

@Component({
  imports: [],
  selector: 'a[atomButton], button[atomButton]',
  styleUrl: './button.scss',
  template: `<ng-content />`,
  hostDirectives: [Ripple],
  host: {...BUTTON_HOST, class: 'default-content'},
})
export class Button extends ButtonBase {}

@Component({
  imports: [],
  selector: 'a[atomIconButton], button[atomIconButton]',
  styleUrl: './button.scss',
  template: `<ng-content select="i, svg" />`,
  hostDirectives: [Ripple],
  host: {...BUTTON_HOST, class: 'icon-only'},
})
export class IconButton extends ButtonBase {}

export function dynamicMatch(width: number, rule: ResizeRule) {
  const target = BREAKPOINTS[rule.breakpoint];
  return rule.direction === 'down' ? width <= target : width >= target;
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

const cartItems = signal<CartItem[]>([
  {id: '1', name: 'Клавиатура', price: 3000, qty: 1},
  {id: '2', name: 'Мышь', price: 1500, qty: 2},
  {id: '3', name: 'Коврик', price: 500, qty: 1},
]);

const mostExpensiveLine = computed(() => {
  // товар, у которого price * qty — максимальный
  //
});
