import {Component, computed, debounced, ElementRef, signal, viewChild} from '@angular/core';

@Component({
  imports: [],
  selector: 'simple-calculator',
  styleUrl: './simple-calculator.scss',
  templateUrl: './simple-calculator.html',
})
export class SimpleCalculator {
  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  private inputValue = signal('');
  private debouncedValue = debounced(() => this.inputValue(), 70);
  public computedValue = computed(() => {
    if (!this.debouncedValue.value()) return;
    const parsedValue = parseFloat(this.debouncedValue.value());
    const weekValue = parsedValue * 7;
    return weekValue.toString();
  });
  
  public filterInput() {
    const inputEl = this.inputRef()?.nativeElement;
    if (!inputEl) return;
    const value = inputEl.value;
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(cleanedValue);
    if (Number.isNaN(parsedValue)) {
      inputEl.value = '';
      this.inputValue.set('');
      return;
    }
    if (parsedValue > 24) {
      const max = '24';
      inputEl.value = max;
      this.inputValue.set(max);
      return;
    }
    inputEl.value = cleanedValue;
    this.inputValue.set(cleanedValue);
  }
}
