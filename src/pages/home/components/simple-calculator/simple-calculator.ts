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
    const formattedValue = (+weekValue.toFixed(2)).toString();
    return formattedValue.concat('ч.');
  });
  public message = computed(() => {
    const rawValue = this.computedValue();
    if (!rawValue) return 'Введите число чтобы получить результат';
    const value = parseFloat(rawValue);
    if (value <= 0.5) return `Выглядит подозрительно...`;
    if (value < 14) return 'Кажется, вы пользуетесь им только по делу — отличный результат!';
    if (value < 35) return 'Вполне разумный баланс между реальной жизнью и уведомлениями.';
    if (value < 56)
      return 'за неделю (~5–8 часов в день). Телефон явно стал вашим главным спутнико';
    if (value < 84)
      return 'Это больше половины вашего времени бодрствования. Пора бы и на улицу выйти!';
    if (value < 112)
      return 'Вы проводите в экране больше времени, чем люди на полноразмерной работе.';
    if (value < 140) return 'Вы вообще успеваете спать или телефон заряжается прямо вместе с вами?';
    if (value < 156) return 'Вы практически живёте в сети — надеемся, там хотя бы интересно!';
    if (value <= 168) return 'Вы вообще спите?';
    return 'Введите число чтобы получить результат';
  });

  public filterInput() {
    const inputEl = this.inputRef()?.nativeElement;
    if (!inputEl) return;
    const value = inputEl.value;
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(cleanedValue);
    if (cleanedValue.length > 4) {
      inputEl.value = cleanedValue.slice(0, 4);
      this.inputValue.set(cleanedValue.slice(0, 4));
      return;
    }
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
    if (/^0+$/.test(cleanedValue)) {
      inputEl.value = '0';
      this.inputValue.set('0');
      return;
    }

    inputEl.value = cleanedValue;
    this.inputValue.set(cleanedValue);
  }
}
