import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from '../widgets/header/header';
import {Footer} from '../widgets/footer/footer';
import {FloatingButton} from '@features/floating-button/floating-button';

@Component({
  imports: [RouterOutlet, Header, Footer, FloatingButton],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
