import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe which transforms milliseconds to seconds and hundredths of seconds.
 */
@Pipe({ name: 'msToSeconds' })
export class MsToSecondsPipe implements PipeTransform {
  transform(milliseconds: number): string {
    const roundedMilliseconds = this.roundOnTen(milliseconds);
    const seconds = Math.floor(roundedMilliseconds / 1000);
    const hundredths = Math.floor((roundedMilliseconds % 1000) / 10)
      .toString()
      .padStart(2, '0'); // always show two digits and fill up with zeros
    return `${seconds}.${hundredths}`;
  }

  private roundOnTen(num: number): number {
    return Math.round(num / 10) * 10;
  }
}
