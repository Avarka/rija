import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorConverter',
})
export class ColorConverterPipe implements PipeTransform {
  transform(value: string): string {
    let hex = value.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, 0.4)`;
    return rgba;
  }
}
