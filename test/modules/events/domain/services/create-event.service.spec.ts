import { mock, MockProxy } from 'jest-mock-extended';

import { CreateEventService } from '@/modules/events/domain/services/create-event.service';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';

describe('CreateEventService', () => {
  let dateProviderMock: MockProxy<DateProvider>;
  let createEventService: CreateEventService;

  beforeEach(() => {
    dateProviderMock = mock();

    dateProviderMock.isBefore.mockReturnValue(false);

    createEventService = new CreateEventService(dateProviderMock);
  });

  it('Deve criar um evento', () => {
    const params = {
      name: 'Evento de teste',
      url: 'evento-de-teste',
      date: ['2021-10-10', '2021-10-09'],
      hourStart: '10:00',
      hourEnd: '12:00',
      accountId: '1',
      organizationId: '1',
    };

    const { event, sessions } = createEventService.execute(params);

    expect(event.id).toBeDefined();
    expect(event.name).toBe(params.name);
    expect(event.url).toBe(params.url);
    expect(event.inscriptionType).toBe('released');

    expect(sessions.length).toBe(2);
    expect(sessions[0].id).toBeDefined();
    expect(sessions[0].eventId).toBe(event.id);
    expect(sessions[0].date).toBe('2021-10-09');
    expect(sessions[0].isCurrent).toBeTruthy();
  });

  it('Deve criar um evento com sessão única', () => {
    const params = {
      name: 'Evento de teste',
      url: 'evento-de-teste',
      date: ['2021-10-10'],
      hourStart: '10:00',
      hourEnd: '12:00',
      accountId: '1',
      organizationId: '1',
    };

    const { event, sessions } = createEventService.execute(params);

    expect(event.id).toBeDefined();
    expect(event.name).toBe(params.name);
    expect(event.url).toBe(params.url);
    expect(event.inscriptionType).toBe('released');

    expect(sessions.length).toBe(1);
    expect(sessions[0].id).toBeDefined();
    expect(sessions[0].eventId).toBe(event.id);
    expect(sessions[0].date).toBe('2021-10-10');
    expect(sessions[0].isCurrent).toBeTruthy();
  });

  it('Não deve criar um evento com data inválida', () => {
    const params = {
      name: 'Evento de teste',
      url: 'evento-de-teste',
      date: [],
      hourStart: '10:00',
      hourEnd: '12:00',
      accountId: '1',
      organizationId: '1',
    };

    expect(() => createEventService.execute(params)).toThrow(
      new Error('Date is required'),
    );
  });

  it('Deve retornar erro ao criar um evento com data passada', () => {
    dateProviderMock.isBefore.mockReturnValue(true);

    const params = {
      name: 'Evento de teste',
      url: 'evento-de-teste',
      date: ['2021-10-10'],
      hourStart: '10:00',
      hourEnd: '12:00',
      accountId: '1',
      organizationId: '1',
    };

    expect(() => createEventService.execute(params)).toThrow(
      new Error('Date is before current date'),
    );
  });
});
