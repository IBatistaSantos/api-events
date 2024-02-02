import { Session } from '@/modules/sessions/domain/session';
import { faker } from '@faker-js/faker';

describe('Session', () => {
  it('Deve criar uma sessão', () => {
    const params = {
      date: faker.date.future().toISOString(),
      eventId: faker.string.uuid(),
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
    };

    const session = new Session(params);

    expect(session.id).toBeDefined();
    expect(session.date).toBe(params.date);
    expect(session.eventId).toBe(params.eventId);
    expect(session.hourStart).toBe(params.hourStart);
    expect(session.hourEnd).toBe(params.hourEnd);
  });

  it('Deve retornar erro ao criar uma sessão sem eventId', () => {
    const params = {
      date: faker.date.future().toISOString(),
      eventId: '',
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
    };

    expect(() => new Session(params)).toThrow('EventId is required');
  });

  it('Deve retornar erro ao criar uma sessão sem hourStart', () => {
    const params = {
      date: faker.date.future().toISOString(),
      eventId: faker.string.uuid(),
      hourStart: '',
      hourEnd: faker.date.future().toISOString(),
    };

    expect(() => new Session(params)).toThrow('HourStart is required');
  });

  it('Deve retornar erro ao criar uma sessão sem date', () => {
    const params = {
      date: '',
      eventId: faker.string.uuid(),
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
    };

    expect(() => new Session(params)).toThrow('Date is required');
  });

  describe('sort', () => {
    it('Deve ordenar as sessões com preferencia as current`s', () => {
      const sessions = [
        new Session({
          date: '2022-12-12',
          eventId: faker.string.uuid(),
          hourStart: '12:00',
          hourEnd: '14:00',
          isCurrent: false,
        }),
        new Session({
          date: '2022-12-12',
          eventId: faker.string.uuid(),
          hourStart: '12:00',
          hourEnd: '14:00',
          isCurrent: true,
        }),
      ];

      const sorted = Session.sort(sessions);

      expect(sorted[0].isCurrent).toBeTruthy();
    });

    it('Deve ordenar as sessões por data ', () => {
      const sessions = [
        new Session({
          date: '2022-12-12',
          eventId: faker.string.uuid(),
          hourStart: '12:00',
          hourEnd: '14:00',
          isCurrent: false,
        }),
        new Session({
          date: '2022-09-13',
          eventId: faker.string.uuid(),
          hourStart: '12:00',
          hourEnd: '14:00',
          isCurrent: false,
        }),
      ];

      const sorted = Session.sort(sessions);

      expect(sorted[0].date).toBe('2022-09-13');
    });
  });
});
