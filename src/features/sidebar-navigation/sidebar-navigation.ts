import {Component, inject} from '@angular/core';
import {isActive, Router} from '@angular/router';
import {DEBOUNCE_ROUTE_TRANSITION_TIME} from '@shared/constants/global';
import {SidebarNavItem} from '@widgets/sidebar/components/sidebar-nav-item/sidebar-nav-item';

@Component({
  imports: [SidebarNavItem],
  selector: 'atom-sidebar-navigation',
  styleUrl: './sidebar-navigation.scss',
  templateUrl: './sidebar-navigation.html',
})
export class SidebarNavigation {
  private readonly router: Router = inject(Router);
  private timer?: ReturnType<typeof setTimeout>;
  public isActiveRoute(path: string) {
    const parsedPath = path.startsWith('/') ? path : `/${path}`;
    return isActive(parsedPath, this.router, {paths: 'exact'});
  }

  public go(path: string) {
    const parsedPath = path.startsWith('/') ? path : `/${path}`;
    clearTimeout(this.timer);
    this.timer = setTimeout(
      () => this.router.navigate([parsedPath]),
      DEBOUNCE_ROUTE_TRANSITION_TIME,
    );
  }
}
