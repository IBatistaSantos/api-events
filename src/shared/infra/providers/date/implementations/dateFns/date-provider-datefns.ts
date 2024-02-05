import { isBefore, isAfter as isAfterFNS } from 'date-fns';
import { DateProvider } from '../../date-provider';

export class DateProviderDateFns implements DateProvider {
  isAfter(date: Date, dateToCompare: Date): boolean {
    return isAfterFNS(dateToCompare, date);
  }
  isBefore(date: Date, dateToCompare: Date): boolean {
    return isBefore(date, dateToCompare);
  }
}
