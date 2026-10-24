import {inject} from '@angular/core';
import {CanMatchFn, Router} from '@angular/router';

export const appEntryGuard: CanMatchFn = () => {
  const router = inject(Router);
  return router.createUrlTree(['app']);
};
