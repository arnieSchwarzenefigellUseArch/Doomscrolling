import { Component } from '@angular/core';
export { ContainerHalf } from './container-half/container-half';
export { MinContainer } from './min-container/min-container';

@Component({
  imports: [],
  selector: 'container',
  styleUrl: './container.scss',
  template: `<ng-content />`,
})
export class Container {}
