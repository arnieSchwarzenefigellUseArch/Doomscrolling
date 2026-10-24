import {Component, inject, input} from '@angular/core';
import {isActive, Router} from '@angular/router';
import {DEBOUNCE_ROUTE_TRANSITION_TIME} from '@shared/constants/global';
import {Button} from '@shared/ui/button/button';
import {SidebarStateService} from '@widgets/sidebar/services/sidebar-state';

@Component({
  imports: [Button],
  selector: 'atom-sidebar-nav-item',
  styleUrl: './sidebar-nav-item.scss',
  templateUrl: './sidebar-nav-item.html',
})
export class SidebarNavItem {
  private readonly router = inject(Router);
  protected readonly state = inject(SidebarStateService);
  private timeout!: ReturnType<typeof setTimeout>;

  label = input<string>('');
  icon = input<string>('');
  route = input<string>('');

  protected isActiveRoute(path: string) {
    const parsedPath = path.startsWith('/') ? path : `/${path}`;
    return isActive(parsedPath, this.router, {paths: 'exact'});
  }
  protected go(path: string) {
    const parsedPath = path.startsWith('/') ? path : `/${path}`;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.router.navigate([parsedPath]);
      if (this.state.isMobile()) this.state.changeState();
    }, DEBOUNCE_ROUTE_TRANSITION_TIME);
  }
}
