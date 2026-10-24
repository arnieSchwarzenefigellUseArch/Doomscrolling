import {Component, inject} from '@angular/core';
import {Container} from '@ui/container/container';
import {HeaderActions} from './header-actions/header-actions';
import {IconButton} from '@shared/ui/button/button';
import {SidebarStateService} from '@widgets/sidebar/services/sidebar-state';

@Component({
  imports: [Container, HeaderActions, IconButton],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  protected sidebar = inject(SidebarStateService);
}
