import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from '../widgets/header/header';
import {Footer} from '../widgets/footer/footer';
import {FloatingButton} from '@features/floating-button/floating-button';
import {Sidebar} from '@widgets/sidebar/sidebar';
import {SidebarNavigation} from '@features/sidebar-navigation/sidebar-navigation';

@Component({
  imports: [RouterOutlet, Header, Footer, FloatingButton, Sidebar, SidebarNavigation],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
