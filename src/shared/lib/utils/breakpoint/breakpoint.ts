import {BREAKPOINTS} from '@constants/breakpoints.js';
import {type Breakpoints} from '@type/breakpoints.js';

export function breakpointQuery(bp: keyof Breakpoints) {
  return `(max-width: ${BREAKPOINTS[bp] - 1}px)`;
}
export function breakpointUpQuery(bp: keyof Breakpoints) {
  return `(min-width: ${BREAKPOINTS[bp]}px)`;
}
export function breakpointBetweenQuery(min: keyof Breakpoints, max: keyof Breakpoints) {
  return `(min-width: ${BREAKPOINTS[min]}px) and (max-width: ${BREAKPOINTS[max] - 1}px)`;
}

export function breakpoint(bp: keyof Breakpoints) {
  return window.matchMedia(breakpointQuery(bp)).matches;
}
export function breakpointUp(bp: keyof Breakpoints) {
  return window.matchMedia(breakpointUpQuery(bp)).matches;
}
export function breakpointBetween(min: keyof Breakpoints, max: keyof Breakpoints) {
  return window.matchMedia(breakpointBetweenQuery(min, max)).matches;
}
