import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value) return value;

    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based.
    const day = date.getDate();

    return `${year}-${this.padZero(month)}-${this.padZero(day)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
