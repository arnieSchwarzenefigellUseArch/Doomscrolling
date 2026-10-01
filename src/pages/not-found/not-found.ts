import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Container} from '@shared/ui/container/container';

@Component({
  imports: [Container, RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.scss',
  templateUrl: './not-found.html',
})
export class NotFound {}
