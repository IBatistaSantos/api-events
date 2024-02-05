export interface DateProvider {
  isBefore(date: Date, dateToCompare: Date): boolean;
  isAfter(date: Date, dateToCompare: Date): boolean;
}
