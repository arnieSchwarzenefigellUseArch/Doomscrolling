import {gsap} from 'gsap';
import {isPlatformBrowser} from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  createEnvironmentInjector,
  EnvironmentInjector,
  inputBinding,
  outputBinding,
  PLATFORM_ID,
  Service,
  TemplateRef,
} from '@angular/core';
import {inject} from '@angular/core';
import {BottomSheetComponent} from '@shared/ui/bottom-sheet/bottom-sheet';

type TemplateType = TemplateRef<unknown> | (() => TemplateRef<unknown>);

@Service()
export class BottomSheet {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);
  private readonly platformId = inject(PLATFORM_ID);
  private ref!: ComponentRef<BottomSheetComponent>;

  private resolveTpl(tpl: TemplateType) {
    return typeof tpl === 'function' ? tpl() : tpl;
  }
  open(tpl: TemplateType) {
    const envInjector = createEnvironmentInjector([], this.injector);
    this.ref = createComponent(BottomSheetComponent, {
      environmentInjector: envInjector,
      bindings: [
        inputBinding('tpl', () => this.resolveTpl(tpl)),
        outputBinding('stateEmitter', () => this.close()),
      ],
    });
    this.appRef.attachView(this.ref.hostView);
    if (isPlatformBrowser(this.platformId))
      document.body.appendChild(this.ref.location.nativeElement);
  }

  close<T extends BottomSheetCloseFeatureKind>(...features: BottomSheetCloseFeature<T>[]) {
    
  }
}

export type BottomSheetCloseFeatureKind = 'withDestroy' | 'withSlideUp';
export interface BottomSheetCloseFeature<KindT extends BottomSheetCloseFeatureKind> {
  kind: KindT;
  run: (el: HTMLElement, ref: ComponentRef<BottomSheetComponent>) => void | Promise<void>;
}
function createCloseFeature<K extends BottomSheetCloseFeatureKind>(
  kind: K,
  run: (el: HTMLElement, ref: ComponentRef<BottomSheetComponent>) => void | Promise<void>,
): BottomSheetCloseFeature<K> {
  return {
    kind,
    run,
  };
}
export function withDestroy(): BottomSheetCloseFeature<'withDestroy'> {
  return createCloseFeature('withDestroy', (el, ref) => {
    gsap.to(el, {});
  });
}

export function withSlideUp() {}
