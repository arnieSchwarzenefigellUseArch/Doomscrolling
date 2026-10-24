export type SidebarState = 'collapsed' | 'expanded';

export const DEFAULT_SIDEBAR_STATE = 'collapsed' satisfies SidebarState;
export const SIDEBAR_STATE_LOCALSTORAGE_KEY = 'sidebarState' as const;

export const COLLAPSED_SIDEBAR_WIDTH = '56px' as const;
export const EXPANDED_SIDEBAR_WIDTH = '288px' as const;

export const SIDEBAR_ANIMATION_EASING = 'standard' as const;
export const SIDEBAR_ANIMATION_DURATION = 0.3 as const;
