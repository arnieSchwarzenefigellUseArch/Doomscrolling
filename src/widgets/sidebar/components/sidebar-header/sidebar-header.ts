import {Component, inject, input, output} from '@angular/core';
import {SidebarHeaderButtons} from './sidebar-header-buttons/sidebar-header-buttons';
import {IconButton} from '@shared/ui/button/button';
import {SidebarStateService} from '@widgets/sidebar/services/sidebar-state';

@Component({
  imports: [SidebarHeaderButtons, IconButton],
  selector: 'atom-sidebar-header',
  styleUrl: './sidebar-header.scss',
  templateUrl: `./sidebar-header.html`,
})
export class SidebarHeader {
  sidebarState = inject(SidebarStateService);
}
