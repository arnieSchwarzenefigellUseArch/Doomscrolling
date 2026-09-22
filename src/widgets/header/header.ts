import {Component} from '@angular/core';
import {Container} from '@ui/container/container';
import {HeaderActions} from './header-actions/header-actions';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Button} from '@ui/button/button';

@Component({
  imports: [Container, HeaderActions, RouterLink, RouterLinkActive, Button],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
}
