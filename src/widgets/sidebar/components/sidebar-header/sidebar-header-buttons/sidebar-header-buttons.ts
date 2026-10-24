import {Component, inject} from '@angular/core';
import {IconButton} from '@shared/ui/button/button';
import {SidebarStateService} from '@widgets/sidebar/services/sidebar-state';

@Component({
  imports: [IconButton],
  selector: 'atom-sidebar-header-buttons',
  styleUrl: './sidebar-header-buttons.scss',
  templateUrl: './sidebar-header-buttons.html',
})
export class SidebarHeaderButtons {
  protected readonly sidebarState = inject(SidebarStateService);
}
