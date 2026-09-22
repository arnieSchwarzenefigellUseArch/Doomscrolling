import {Component} from '@angular/core';
import { Card } from '../card/card';

@Component({
  imports: [Card],
  selector: 'callout',
  styleUrl: './callout.scss',
  templateUrl: './callout.html',
})
export class Callout {}
