import {isPlatformBrowser} from '@angular/common';
import {Service, WritableSignal, signal, effect, PLATFORM_ID, inject} from '@angular/core';

type ThemeType = 'dark' | 'light';

@Service()
export class Theme {
  private platformId = inject(PLATFORM_ID);
  private savedTheme = isPlatformBrowser(this.platformId)
    ? (localStorage.getItem('theme') as ThemeType)
    : null;
  private state: WritableSignal<ThemeType> = signal<ThemeType>(this.savedTheme ?? 'light');

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.dataset['theme'] = this.state();
      }
    });
  }

  toggleTheme() {
    const currentTheme = this.state();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.state.set(newTheme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', newTheme);
    }
  }

  public get getTheme() {
    return this.state;
  }
}
