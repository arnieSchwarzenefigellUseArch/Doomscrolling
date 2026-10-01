import {Component, input} from '@angular/core';
import {ClusterDirection, ClusterVariants} from '@type/cluster';

@Component({
  imports: [],
  selector: 'atom-cluster',
  styleUrl: './cluster.scss',
  template: `<ng-content />`,
  host: {
    class: 'atom-cluster',
    '[class]': '`cluster-${variant()} cluster-${direction()}`',
  },
})
export class Cluster {
  public variant = input<ClusterVariants>('default');
  public direction = input<ClusterDirection>('horizontal');
}
