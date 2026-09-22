import {Component} from '@angular/core';
import {Container, ContainerHalf} from '@shared/ui/container/container';
import {Dropdown} from '@shared/ui/dropdown/dropdown';
import {Card} from '@shared/ui/card/card';
import {Callout} from '@shared/ui/callout/callout';
import {AtomReveal} from '@shared/directives/animations';
import { SimpleCalculator } from './components/simple-calculator/simple-calculator';

@Component({
  imports: [Container, ContainerHalf, Dropdown, Card, AtomReveal, Callout, SimpleCalculator],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
