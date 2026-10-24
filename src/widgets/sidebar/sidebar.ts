import {
  afterNextRender,
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import {
  COLLAPSED_SIDEBAR_WIDTH,
  EXPANDED_SIDEBAR_WIDTH,
  SIDEBAR_ANIMATION_DURATION,
  SIDEBAR_ANIMATION_EASING,
} from './sidebar.model';
import {gsap} from 'gsap';
import {SidebarFooter} from './components/sidebar-footer/sidebar-footer';
import {SidebarHeader} from './components/sidebar-header/sidebar-header';
import {SidebarItems} from './components/sidebar-items/sidebar-items';
import '@shared/lib/animations/easing';
import {isPlatformBrowser} from '@angular/common';
import {SidebarStateService} from './services/sidebar-state';
import {AtomFade} from '@shared/directives/animations';

@Component({
  imports: [SidebarFooter, SidebarHeader, SidebarItems, AtomFade],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
  host: {
    '[class]': 'state.getState()()',
    '[class.hidden]': 'hideable()',
    '[class.mobile]': 'state.isMobile()',
  },
})
export class Sidebar {
  private readonly el: ElementRef = inject(ElementRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer: Renderer2 = inject(Renderer2);
  protected readonly state: SidebarStateService = inject(SidebarStateService);
  private ctx: gsap.Context;

  constructor() {
    this.ctx = gsap.context(() => {}, this.el.nativeElement);
    afterNextRender({
      write: () => {
        document.documentElement.style.setProperty('--sidebar-width', COLLAPSED_SIDEBAR_WIDTH);
        document.documentElement.style.setProperty(
          '--sidebar-expanded-width',
          EXPANDED_SIDEBAR_WIDTH,
        );
        document.documentElement.style.setProperty(
          '--sidebar-collapsed-width',
          COLLAPSED_SIDEBAR_WIDTH,
        );
      },
    });
    afterRenderEffect({
      write: (onCleanup) => {
        const state = this.state.getState()();
        this.renderer[state === 'expanded' ? 'addClass' : 'removeClass'](
          document.documentElement,
          'sidebar-opened',
        );
        this.renderer[this.hideable() ? 'addClass' : 'removeClass'](
          document.documentElement,
          'sidebar-hidden',
        );
        this.renderer[this.state.isMobile() ? 'addClass' : 'removeClass'](
          document.documentElement,
          'sidebar-mobile',
        );
        this.ctx.add(() => (state === 'collapsed' ? this.toCollapsed() : this.toExpanded()));
        onCleanup(() => {
          this.ctx.kill();
        });
      },
    });

    this.destroyRef.onDestroy(() => {
      this.ctx.revert();
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.style.removeProperty('--sidebar-width');
      }
    });
  }

  protected hideable() {
    return this.state.isMobile() && this.state.getState()() === 'collapsed';
  }

  private toCollapsed() {
    gsap.to(document.documentElement, {
      '--sidebar-width': COLLAPSED_SIDEBAR_WIDTH,
      duration: SIDEBAR_ANIMATION_DURATION,
      ease: SIDEBAR_ANIMATION_EASING,
      overwrite: true,
      onStart: () => {
        this.toggleOverflow('visible');
      },
    });
  }
  private toExpanded() {
    gsap.to(document.documentElement, {
      '--sidebar-width': EXPANDED_SIDEBAR_WIDTH,
      duration: SIDEBAR_ANIMATION_DURATION,
      ease: SIDEBAR_ANIMATION_EASING,
      overwrite: true,
      onStart: () => {
        this.toggleOverflow('hidden');
      },
    });
  }
  private toggleOverflow(toggle: 'visible' | 'hidden') {
    if (!this.state.isMobile()) return;
    this.renderer.setStyle(document.body, 'overflow-y', toggle);
  }
}
