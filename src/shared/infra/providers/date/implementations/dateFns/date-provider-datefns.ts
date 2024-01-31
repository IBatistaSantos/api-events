import { isBefore } from 'date-fns';
import { DateProvider } from '../../date-provider';

export class DateProviderDateFns implements DateProvider {
  isBefore(date: Date, dateToCompare: Date): boolean {
    return isBefore(date, dateToCompare);
  }
}
