import {
  isBefore,
  isAfter as isAfterFNS,
  isToday as isTodayFNS,
} from 'date-fns';
import { DateProvider } from '../../date-provider';

export class DateProviderDateFns implements DateProvider {
  today(date: Date): boolean {
    return isTodayFNS(date);
  }
  isAfter(date: Date, dateToCompare: Date): boolean {
    return isAfterFNS(dateToCompare, date);
  }
  isBefore(date: Date, dateToCompare: Date): boolean {
    return isBefore(date, dateToCompare);
  }
}
