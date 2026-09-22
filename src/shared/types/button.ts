import {Breakpoints} from './breakpoints';

export type ButtonVariants = 'primary' | 'secondary' | 'simple' | 'ghost';
export type ButtonSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';
export type ButtonAnimations = 'none' | 'border-sweep';
export type ResizeRule = {
  breakpoint: keyof Breakpoints;
  direction: 'up' | 'down';
  size: ButtonSizes;
};
