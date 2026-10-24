import {
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {breakpointQuery, breakpointUpQuery} from '@shared/lib/utils/breakpoint/breakpoint';
import {Button} from '@ui/button/button';
import {gsap} from 'gsap';
import '@shared/lib/animations/easing';

export type BottomSheetState = 'collapsed' | 'halfExpanded' | 'fullyExpanded';
const POSITION: Record<BottomSheetState, number> = {
  collapsed: 0,
  halfExpanded: 50,
  fullyExpanded: 100,
};

@Component({
  imports: [Button],
  selector: 'atom-bottom-sheet',
  styleUrl: './bottom-sheet.scss',
  templateUrl: './bottom-sheet.html',
})
export class BottomSheetComponent {
  private readonly host = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  stateEmitter = output<BottomSheetState>();
  state = signal<BottomSheetState>('halfExpanded');
  tpl = input.required<TemplateRef<unknown>>();
  anchor = viewChild<string, ViewContainerRef>('container', {read: ViewContainerRef});
  private mm!: gsap.MatchMedia;

  constructor() {
    afterRenderEffect({
      write: (onCleanup) => {
        const vcr = this.anchor();
        if (!vcr) return;
        this.mm = gsap.matchMedia();
        vcr.createEmbeddedView(this.tpl());
        onCleanup(() => {
          vcr.clear();
        });
      },
    });
    this.destroyRef.onDestroy(() => {
      this.mm?.revert();
    });
  }

  changeState(state: BottomSheetState) {
    this.state.set(state);
    if (state === 'collapsed') {
      this.stateEmitter.emit(state);
    }
  }

  private toState(desktopCb: () => void, mobileCb: () => void) {
    this.mm.add(breakpointUpQuery('desktop'), desktopCb);
    this.mm.add(breakpointQuery('desktop'), mobileCb);
  }

  private toHalfExpanded() {
    const animationCb = () => {
      gsap.fromTo(
        this.host.nativeElement,
        {
          yPercent: POSITION.collapsed,
        },
        {
          yPercent: POSITION.halfExpanded,
          duration: 0.3,
          ease: 'standard',
        },
      );
    };
    this.toState(animationCb, animationCb);
  }
  private toFullyExpanded() {
    const animationCb = () => {
      gsap.fromTo(
        this.host.nativeElement,
        {
          yPercent: POSITION.halfExpanded,
        },
        {
          yPercent: POSITION.fullyExpanded,
          duration: 0.3,
          ease: 'standard',
        },
      );
    };
    this.toState(animationCb, animationCb);
  }

  private toCollapsed() {
    const animationCb = () => {
      gsap.fromTo(
        this.host.nativeElement,
        {
          yPercent: POSITION.fullyExpanded,
        },
        {
          yPercent: POSITION.collapsed,
          duration: 0.45,
          ease: 'standardExit',
        },
      );
    };
    this.toState(animationCb, animationCb);
  }

  reflow() {
    if (this.state() === 'collapsed') {
      this.changeState('halfExpanded');
      this.toHalfExpanded();
    } else if (this.state() === 'halfExpanded') {
      this.changeState('fullyExpanded');
      this.toFullyExpanded();
    } else {
      this.changeState('collapsed');
      this.toCollapsed();
    }
  }
}
