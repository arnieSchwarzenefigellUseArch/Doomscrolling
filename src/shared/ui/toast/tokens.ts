import {InjectionToken} from '@angular/core';

export type ToastData = {
  header: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text?: string;
};

export const TOAST_DATA = new InjectionToken<ToastData>('TOAST_DATA');
export const TOAST_CLOSE = new InjectionToken<() => void>('TOAST_CLOSE');
export const TOAST_TIMER_PAUSE = new InjectionToken<() => void>('TOAST_TIMER_PAUSE');
export const TOAST_TIMER_RESUME = new InjectionToken<() => void>('TOAST_TIMER_RESUME');
