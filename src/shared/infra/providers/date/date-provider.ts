export interface DateProvider {
  isBefore(date: Date, dateToCompare: Date): boolean;
}