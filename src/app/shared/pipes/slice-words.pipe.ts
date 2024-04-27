import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceWords',
})
export class SliceWordsPipe implements PipeTransform {
  transform(value: string, start: number, end?: number): string {
    if (end && value.split(' ').length <= end) return value;
    return value.split(' ').splice(start, end).join(' ').concat('...');
  }
}
