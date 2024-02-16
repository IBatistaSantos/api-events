import { Schedule } from '@/modules/schedule/domain/schedule';
import { faker } from '@faker-js/faker';

describe('Schedule', () => {
  it('Deve criar uma agenda ', () => {
    const props = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      type: 'schedule',
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      hourStart: '10:00',
      hourEnd: '11:00',
      panelist: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          description: faker.lorem.sentence(),
        },
      ],
    };

    const schedule = new Schedule({
      sessionId: props.sessionId,
      eventId: props.eventId,
      type: props.type,
      title: props.title,
      description: props.description,
      hourStart: props.hourStart,
      hourEnd: props.hourEnd,
      panelist: props.panelist,
    });

    expect(schedule.id).toBeDefined();
    expect(schedule.position).toBe(0);
    expect(schedule.sessionId).toBe(props.sessionId);
    expect(schedule.eventId).toBe(props.eventId);
    expect(schedule.type).toBe(props.type);
    expect(schedule.title).toBe(props.title);
    expect(schedule.description).toBe(props.description);
    expect(schedule.hourStart).toBe(props.hourStart);
    expect(schedule.hourEnd).toBe(props.hourEnd);
    expect(schedule.panelist).toEqual(props.panelist);
    expect(schedule.toJSON()).toEqual({
      id: schedule.id,
      position: 0,
      status: 'ACTIVE',
      sessionId: props.sessionId,
      eventId: props.eventId,
      type: props.type,
      title: props.title,
      description: props.description,
      hourStart: props.hourStart,
      panelist: props.panelist,
      hourEnd: props.hourEnd,
    });
  });

  it('Deve criar uma agenda com tipo de agendamento inválido', () => {
    expect(() => {
      new Schedule({
        sessionId: faker.string.uuid(),
        eventId: faker.string.uuid(),
        type: 'invalid',
        title: 'title',
        description: 'description',
        hourStart: '10:00',
        hourEnd: '11:00',
      });
    }).toThrow('O tipo de agendamento é inválido');
  });

  it('Deve retornar erro sem horário de início e fim e o tipo for schedule', () => {
    expect(() => {
      new Schedule({
        sessionId: faker.string.uuid(),
        eventId: faker.string.uuid(),
        type: 'schedule',
        title: 'title',
        description: 'description',
      });
    }).toThrow('O horário de início e fim são obrigatórios');
  });

  it('Deve retornar erro se o nome do panelista for invalido', () => {
    expect(() => {
      new Schedule({
        sessionId: faker.string.uuid(),
        eventId: faker.string.uuid(),
        type: 'schedule',
        title: 'title',
        description: 'description',
        hourStart: '10:00',
        hourEnd: '11:00',
        panelist: [
          {
            id: faker.string.uuid(),
            name: '',
            description: faker.lorem.sentence(),
          },
        ],
      });
    }).toThrow('O nome do painelista é obrigatório');
  });

  it('Deve retornar erro se o ID do panelista for invalido', () => {
    expect(() => {
      new Schedule({
        sessionId: faker.string.uuid(),
        eventId: faker.string.uuid(),
        type: 'schedule',
        title: 'title',
        description: 'description',
        hourStart: '10:00',
        hourEnd: '11:00',
        panelist: [
          {
            id: '',
            name: faker.person.fullName(),
            description: '',
          },
        ],
      });
    }).toThrow('O id do painelista é obrigatório');
  });

  describe('sort', () => {
    it('Deve ordenar as agendas', () => {
      const schedule1 = new Schedule({
        sessionId: faker.string.uuid(),
        eventId: faker.string.uuid(),
        type: 'schedule',
        title: 'title',
        description: 'description',
        hourStart: '10:00',
        hourEnd: '11:00',
        position: 1,
      });

      const schedule2 = new Schedule({
        sessionId: faker.string.uuid(),
        eventId: faker.string.uuid(),
        type: 'schedule',
        title: 'title',
        description: 'description',
        hourStart: '11:00',
        position: 2,
        hourEnd: '12:00',
      });

      const schedule3 = new Schedule({
        sessionId: faker.string.uuid(),
        eventId: faker.string.uuid(),
        type: 'schedule',
        title: 'title',
        description: 'description',
        hourStart: '09:00',
        position: 0,
        hourEnd: '10:00',
      });

      const schedules = [schedule1, schedule2, schedule3];

      expect(Schedule.sort(schedules)).toEqual([
        schedule3,
        schedule1,
        schedule2,
      ]);
    });
  });
});
