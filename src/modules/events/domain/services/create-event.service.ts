import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { Events } from '../events';
import { Session } from '@/modules/sessions/domain/session';
import { BadException } from '@/shared/domain/errors/errors';

interface Input {
  name: string;
  url: string;
  date: string[];
  hourStart: string;
  hourEnd: string;
  accountId: string;
  organizationId: string;
}

export class CreateEventService {
  constructor(private readonly dateProvider: DateProvider) {}

  execute(params: Input) {
    const { accountId, date, hourEnd, hourStart, name, organizationId, url } =
      params;

    const dateSorted = this.validateDate(date);

    const event = new Events({
      accountId,
      name,
      organizationId,
      url,
    });

    const sessions = dateSorted.map((date, index) => {
      return new Session({
        eventId: event.id,
        date,
        isCurrent: index === 0,
        hourStart,
        hourEnd,
      });
    });

    return { event, sessions };
  }

  private validateDate(date: string[]) {
    if (date.length < 1) {
      throw new BadException('Date is required');
    }

    date.forEach((date) => {
      const isBefore = this.dateProvider.isBefore(new Date(date), new Date());
      if (isBefore) throw new BadException('Date is before current date');
    });

    return this.sortDate(date);
  }

  private sortDate(date: string[]) {
    return date.sort((a, b) => {
      if (new Date(a) < new Date(b)) {
        return -1;
      }
      if (new Date(a) > new Date(b)) {
        return 1;
      }
      return 0;
    });
  }
}
